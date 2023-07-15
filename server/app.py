from flask import Flask,request,jsonify,abort
from googletrans import Translator
from langchain.chat_models import ChatOpenAI
from langchain.agents import load_tools, initialize_agent, AgentType
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from flask import Flask
from flask_cors import CORS

app =Flask(__name__)
CORS(app)

@app.route('/translate', methods=['GET'])
def translate_endpoint():
    text = request.args.get('query')
    
    if not text:
        abort(400, 'Missing query parameter')
    
    try:
        translator = Translator()
        translated_text = translator.translate(text, dest='en') 
        return jsonify(translated_text.text)
    except Exception as e:
        abort(500, f"An error occurred: {str(e)}")

@app.route('/wikipedia', methods=['GET'])
def search_wikipedia_endpoint():
    import wikipedia
    query = request.args.get('query')  # Get the 'query' parameter from the request URL
    if query:
        try:
            results = wikipedia.search(query)
            response = []
            for result in results[:5]:  # Get the first 5 results
                try:
                    page = wikipedia.page(result)
                    response.append({
                        'title': page.title,
                        'content': page.content
                    })
                except wikipedia.exceptions.PageError:
                    pass
            return jsonify(response)
        except wikipedia.exceptions.DisambiguationError as e:
            options = e.options[:5]  # Limit options to first 5
            abort(400, f"Disambiguation page. Options: {options}")
        except Exception as e:
            abort(500, f"An error occurred: {str(e)}")
    else:
        abort(400, 'Missing query parameter.')  

@app.route('/arxiv', methods=['GET'])
def search_arxiv():
    import arxiv
    query = request.args.get('query')
    max_results = request.args.get('max_results', default=5, type=int)
    if query:
        try:
            results = arxiv.Search(query=query, max_results=max_results).get()
            formatted_results = []
            for result in results:
                authors = [author.name for author in result.authors]  # Convert each Author object to its name
                formatted_result = {
                    'title': result.title,
                    'authors': authors,
                    'summary': result.summary,
                    'published': result.published,
                    'pdf_url': result.pdf_url,
                }
                formatted_results.append(formatted_result)

            return jsonify(formatted_results)  # jsonify the entire response
        except Exception as e:
            return jsonify({'error': str(e)})
    else:
        return jsonify({'error': 'Missing query parameter'})

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False
    
""" @app.route('/scrape', methods=['GET'])
def scrape_website(url):
    # Remove any leading or trailing spaces from the URL
    url = "https://news.ycombinator.com/"
    url = url.strip()

    # Check if the URL is valid
    if not is_valid_url(url):
        return json.dumps({"error": "Invalid URL"})

    # If the URL is valid, try to scrape the website
    try:
        response = requests.get(url)
        response.raise_for_status()  # This will raise an exception if the response status is not OK
    except requests.exceptions.HTTPError as http_err:
        return json.dumps({"error": f"HTTP error occurred: {http_err}"})
    except requests.exceptions.RequestException as err:
        return json.dumps({"error": f"An error occurred: {err}"})

    # If the request was successful, parse the website content
    soup = BeautifulSoup(response.text, 'html.parser')
    results = []
    i = 1
    for article_tag in soup.find_all(name="span", class_="titleline"):
        article_title = article_tag.getText().strip()
        article_link = article_tag.find("a")["href"].strip()
        results.append({
            "index": i,
            "title": article_title,
            "link": article_link
        })
        i += 1

    return json.dumps({"articles": results}) """

 
@app.route('/scrape')
def scrape_hacker_news():
    url = 'https://news.ycombinator.com/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    results = []
    i = 1
    for article_tag in soup.find_all(name="span", class_="titleline"):
        article_title = article_tag.getText()
        article_url = article_tag.find("a")["href"]

        article = {
            "title": article_title,
            "url": article_url
        }
        results.append(article)
        i += 1

    # Convert the results to JSON
    json_data = json.dumps(results)
    return json_data
    
def scrape_hacker_news():
    url = 'https://news.ycombinator.com/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    results = []
    i = 1
    for article_tag in soup.find_all(name="span", class_="titleline"):
        article_title = article_tag.getText()
        article_url = article_tag.find("a")["href"]

        article = {
            "title": article_title,
            "url": article_url
        }
        results.append(article)
        i += 1

    # Return the results as JSON
    return results

@app.route('/hacker-news', methods=['GET'])
def hacker_news_endpoint():
    data = scrape_hacker_news()
    return jsonify(data)


from flask import Flask, request, jsonify
import requests
import os
WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('query')

    if city:
        try:
            base_url = "http://api.openweathermap.org/data/2.5/weather"
            params = {
                "q": city,
                "appid": WEATHER_API_KEY,
                "units": "metric"  # Change to "imperial" for Fahrenheit
            }

            response = requests.get(base_url, params=params)
            
            data = response.json()

            if data["cod"] != "404":
                main_data = data["main"]
                temperature = main_data["temp"]
                humidity = main_data["humidity"]
                description = data["weather"][0]["description"]

                result = {
                    "city": city,
                    "temperature": temperature,
                    "humidity": humidity,
                    "description": description
                }

                return jsonify(result), 200
            else:
                return jsonify({"error": "City not found."}), 404

        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    else:
        return jsonify({"error": "City not provided."}), 400

from flask import Flask, request, jsonify
import requests
import os
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate, FewShotPromptTemplate
from langchain.chains import LLMChain
from langchain.agents import load_tools, initialize_agent, AgentType
#from IPython.display import Markdown, HTML

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
@app.route('/lc_text', methods=['GET'])
def lang_chain_text():
    llm = OpenAI(temperature=0.9)
    text = request.args.get('query')
    print(text)
    #text = "What is a good name for a cute mobius strip?"
    print(llm(text))
    return (jsonify(llm(text)))


@app.route('/lc_prompt', methods=['GET'])
def lang_chain_prompt():
    try:
        #llm = OpenAI(model_name="text-davinci-003",temperature=0)
        llm = OpenAI(temperature=0)
        book = request.args.get('query')

        # Check if the 'query' parameter is provided
        if book is None:
            return jsonify({'error': 'Missing query parameter'}), 400

        prompt = PromptTemplate(
            input_variables=["book"],
            template="Who is the author of the book {book}?",
        )
        
        text = prompt.format(book=book)
        author = llm(text)
        
        return jsonify(author)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/lc_tools', methods=['GET'])
def lang_chain_tools():
    llm = OpenAI(temperature=0.9)
    text = request.args.get('query')
    tool_names = ['serpapi',   # for google search
              'llm-math'  # this particular tool needs an llm too, so need to pass that
             ]

    tools = load_tools (tool_names = tool_names, 
                    llm        = llm)
    agent = initialize_agent (tools   = tools, 
                          llm     = llm,
                          agent   = AgentType.ZERO_SHOT_REACT_DESCRIPTION,
                          verbose = True
                         )
    question = """
            What is the height of mount everest in meters today? 
            If an aeroplane has to travel 1 km higher than
            that number, how high should it be?
        """
    output = agent.run(text)
    print(output)
    #text = "What is a good name for a cute mobius strip?"
    return(jsonify(output))

import os
huggingfacehub_api_token = os.environ['HUGGING_FACE_API_KEY']
from flask import Flask, jsonify, request
from transformers import AutoTokenizer, pipeline
import torch    

@app.route('/lc_tools_os', methods=['GET'])
def lang_chain_tools_os():
    import os
    huggingfacehub_api_token = os.environ['HUGGING_FACE_API_KEY']
    from langchain import HuggingFaceHub

    repo_id = "tiiuae/falcon-7b-instruct"
    llm = HuggingFaceHub(huggingfacehub_api_token=huggingfacehub_api_token, 
                     repo_id=repo_id, 
                     model_kwargs={"temperature":0.6, "max_new_tokens":500})
    # llm = OpenAI(temperature=0.9)
    text = request.args.get('query')
    tool_names = ['serpapi',   # for google search
              'llm-math',  # this particular tool needs an llm too, so need to pass that
              'CodeRunner'
             ]

    tools = load_tools (tool_names = tool_names, 
                    llm        = llm)
    agent = initialize_agent (tools   = tools, 
                          llm     = llm,
                          agent   = AgentType.ZERO_SHOT_REACT_DESCRIPTION,
                          verbose = True
                         )
    question = """
            What is the height of mount everest in meters today? 
            If an aeroplane has to travel 1 km higher than
            that number, how high should it be?
        """
    output = agent.run(text)
    print(output)
    #text = "What is a good name for a cute mobius strip?"
    return(jsonify(output))
@app.route('/text_img', methods=['GET'])
def text_img():
    text = request.args.get('query')
    from diffusers import DiffusionPipeline
    import pybase64
    pipeline = DiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
    #pipeline.to("cuda")
    image = pipeline(text).images[0]
    image.save('squirrel-picasso.png')
    with open("squirrel-picasso.png", "rb") as image_file:
        encoded_string = pybase64.b64encode(image_file.read())
    return jsonify(encoded_string.decode('utf-8'))

@app.route('/text_img2', methods=['GET'])
def text_image2():
    from diffusers import DiffusionPipeline, EulerDiscreteScheduler, DPMSolverMultistepScheduler
    text = request.args.get('query')
    repo_id = "runwayml/stable-diffusion-v1-5"
    import pybase64
    scheduler = EulerDiscreteScheduler.from_pretrained(repo_id, subfolder="scheduler")
    # or
    # scheduler = DPMSolverMultistepScheduler.from_pretrained(repo_id, subfolder="scheduler")

    stable_diffusion = DiffusionPipeline.from_pretrained(repo_id, scheduler=scheduler)

    # if you want to use the gpu
    #torch.cuda.empty_cache()
    #stable_diffusion.to("cuda")

    #image = stable_diffusion("Monkey on a boat in a stormy sea.").images[0]
    image = stable_diffusion(text).images[0]
    
    image.save('image2.png')
    with open("image2.png", "rb") as image_file:
        encoded_string = pybase64.b64encode(image_file.read())
    return jsonify(encoded_string.decode('utf-8'))

@app.route('/text_text', methods=['GET'])
def text_text():
    from transformers import pipeline

    MODELS  = ['gpt2', 'distilgpt2', 'facebook/opt-1.3b']
        
    generator = pipeline("text-generation", model=MODELS[0])
    text = request.args.get('query')
    if text =="":
        text = "Education is not the filling of a pail, but the lighting of a fire."
    print(text)
    generated = generator(
       text,
        max_length=100
    )
    return jsonify(generated)
@app.route('/text_video', methods=['GET'])
def text_video():
    import torch
    import imageio
    from diffusers import StableDiffusionPipeline
    from flask import send_file, send_from_directory
    import base64
    import json


    model_id = "runwayml/stable-diffusion-v1-5"
    #model_id = "runwayml/stable-diffusion-inpainting"
    
    pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float32)
    prompt = request.args.get('query')
    #  = "A panda is playing guitar on times square"
    result = pipe(prompt=prompt).images
    ims = []
    for i, image in enumerate(result):
        image_name = f"image_{i:03d}.jpeg"
        imageio.imwrite(image_name, image)  # Save image as JPEG
        ims.append(imageio.imread(image_name))  # Load image as array
    imageio.mimsave("video.mp4", ims, fps=4)
    print("Saved Video")
    with open("video.mp4", "rb") as video_file:
        encoded_string = base64.b64encode(video_file.read())
    return jsonify(encoded_string.decode('utf-8'))  
  
@app.route('/text_txt', methods=['GET'])
def text_query():
    from sentence_transformers import SentenceTransformer
    MODEL = 'msmarco-distilbert-base-v4'
    embedder = SentenceTransformer(MODEL)
    #
    # From "Through the looking Glass" by Lewis Caroll
    #
    jabberwocky = """
    ’Twas brillig, and the slithy toves
        Did gyre and gimble in the wabe:
    All mimsy were the borogoves,
        And the mome raths outgrabe.

    “Beware the Jabberwock, my son!
        The jaws that bite, the claws that catch!
    Beware the Jubjub bird, and shun
        The frumious Bandersnatch!”

    He took his vorpal sword in hand;
        Long time the manxome foe he sought—
    So rested he by the Tumtum tree
        And stood awhile in thought.

    And, as in uffish thought he stood,
        The Jabberwock, with eyes of flame,
    Came whiffling through the tulgey wood,
        And burbled as it came!

    One, two! One, two! And through and through
        The vorpal blade went snicker-snack!
    He left it dead, and with its head
        He went galumphing back.

    “And hast thou slain the Jabberwock?
        Come to my arms, my beamish boy!
    O frabjous day! Callooh! Callay!”
        He chortled in his joy.

    ’Twas brillig, and the slithy toves
        Did gyre and gimble in the wabe:
    All mimsy were the borogoves,
        And the mome raths outgrabe.

    """
    #
    # The beginning of the "Tale of two cities", by Charles Dickens
    #
    best_of_times = """
    It was the best of times, it was the worst of times, 
    it was the age of wisdom, it was the age of foolishness, 
    it was the epoch of belief, it was the epoch of incredulity, 
    it was the season of light, it was the season of darkness, 
    it was the spring of hope, it was the winter of despair, 
    we had everything before us, we had nothing before us, 
    we were all going direct to heaven, 
    we were all going direct the other way–in short, 
    the period was so far like the present period, 
    that some of its noisiest authorities insisted on its being received, 
    for good or for evil, in the superlative degree of comparison only.
    """
    #
    # From the "Tale of two cities" by Charles Dickens
    #
    mystery = """
    A wonderful fact to reflect upon, that every human creature is 
    constituted to be that profound secret and mystery to every other. 
    """
    #
    # A poignant passage from the "Tale of two cities", by Charles Dickens
    #
    last_dream = """
    I wish you to know that you have been the last dream of my soul. 
    In my degradation I have not been so degraded but that the sight 
    of you with your father, and of this home made such a home by you, 
    has stirred old shadows that I thought had died out of me. 
    Since I knew you, I have been troubled by a remorse that I 
    thought would never reproach me again, and have heard whispers 
    from old voices impelling me upward, that I thought were silent 
    for ever. I have had unformed ideas of striving afresh, beginning anew, 
    shaking off sloth and sensuality, and fighting out the abandoned fight. 
    A dream, all a dream, that ends in nothing, and leaves the sleeper 
    where he lay down, but I wish you to know that you inspired it.
    """
    mark_twain_dog = """
    The dog is a gentleman; I hope to go to his heaven not man's.
    """
    einstein = """If a man aspires towards a righteous life, his first act of abstinence is from injury to animals."""
    tweedledee  = """
    Tweedledum and Tweedledee: She then meets the fat twin brothers 
    Tweedledum and Tweedledee, whom she knows from the nursery rhyme. 
    After reciting the long poem "The Walrus and the Carpenter", 
    they draw Alice's attention to the Red King—loudly snoring away 
    under a nearby tree—and maliciously provoke her with idle philosophical 
    banter that she exists only as an imaginary figure in the Red King's dreams. 
    Finally, the brothers begin suiting up for battle, only to be frightened 
    away by an enormous crow, as the nursery rhyme about them predicts.
    """
    goldens_1 = """
    Golden retrievers are not bred to be guard dogs, and considering the size of their hearts and their irrepressible joy and life, they are less likely to bite than to bark, less likely to bark than to lick a hand in greeting. In spite of their size, they think they are lap dogs, and in spite of being dogs, they think they’re also human, and nearly every human they meet is judged to have the potential to be a boon companion who might at any moment, cry, “Let’s go!” and lead them on a great adventure.
    """

    goldens_2 = """
    If you’re lucky, a golden retriever will come into your life, steal your heart, and change everything
    """

    goldens_3 = """
    My friend Phil has a theory that the Lord, having made teenagers, felt constrained to make amends and so created the golden retriever.
    """

    dog_soul = """
    If you don’t believe that dogs have souls, you haven’t looked into their eyes long enough.
    """
    keats = """
    A thing of beauty is a joy for ever:
    Its loveliness increases; it will never
    Pass into nothingness; but still will keep
    A bower quiet for us, and a sleep
    Full of sweet dreams, and health, and quiet breathing.
    Therefore, on every morrow, are we wreathing
    A flowery band to bind us to the earth,
    Spite of despondence, of the inhuman dearth
    Of noble natures, of the gloomy days,
    Of all the unhealthy and o'er-darkn'd ways
    Made for our searching: yes, in spite of all,
    Some shape of beauty moves away the pall
    From our dark spirits. Such the sun, the moon,
    Trees old and young, sprouting a shady boon
    For simple sheep; and such are daffodils
    With the green world they live in; and clear rills
    That for themselves a cooling covert make
    'Gainst the hot season; the mid-forest brake,
    Rich with a sprinkling of fair musk-rose blooms:
    And such too is the grandeur of the dooms
    We have imagined for the mighty dead;
    An endless fountain of immortal drink,
    Pouring unto us from the heaven's brink
    """
    attention = """
    The dominant sequence transduction models are based on 
    complex recurrent or convolutional neural networks in an encoder-decoder configuration. 
    The best performing models also connect the encoder and decoder through 
    an attention mechanism. We propose a new simple network architecture, 
    the Transformer, based solely on attention mechanisms, 
    dispensing with recurrence and convolutions entirely. 
    Experiments on two machine translation tasks show these models 
    to be superior in quality while being more parallelizable 
    and requiring significantly less time to train. 
    Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, 
    improving over the existing best results, including ensembles by over 2 BLEU. 
    On the WMT 2014 English-to-French translation task, our model establishes 
    a new single-model state-of-the-art BLEU score of 41.8 after training for 
    3.5 days on eight GPUs, a small fraction of the training costs of the 
    best models from the literature. We show that the Transformer 
    generalizes well to other tasks by applying it successfully to 
    English constituency parsing both with large and limited training data.

    """
    backprop = """
    In machine learning, backpropagation
    (backprop,[1] BP) is a widely used
    algorithm for training feedforward
    artificial neural networks.
    Generalizations of backpropagation
    exist for other artificial neural
    networks (ANNs), and for functions
    generally. These classes of algorithms
    are all referred to generically as
    "backpropagation".[2] In fitting a
    neural network, backpropagation
    computes the gradient of the loss
    function with respect to the weights of
    the network for a single input–output
    example, and does so efficiently,
    unlike a naive direct computation of
    the gradient with respect to each
    weight individually. This efficiency
    makes it feasible to use gradient
    methods for training multilayer
    networks, updating weights to minimize
    loss; gradient descent, or variants
    such as stochastic gradient descent,
    are commonly used. The backpropagation
    algorithm works by computing the
    gradient of the loss function with
    respect to each weight by the chain
    rule, computing the gradient one layer
    at a time, iterating backward from the
    last layer to avoid redundant
    calculations of intermediate terms in
    the chain rule; this is an example of
    dynamic programming.[3]
    """
    # Wordsworth
    lucy = """
    She dwelt among the untrodden ways
    Beside the springs of Dove,
    A Maid whom there were none to praise
    And very few to love:

    A violet by a mossy stone
    Half hidden from the eye!
    —Fair as a star, when only one
    Is shining in the sky.

    She lived unknown, and few could know
    When Lucy ceased to be;
    But she is in her grave, and, oh,
    The difference to me!

    """

    # Davies
    full_of_cares = """
    What is this life if, full of care,
    We have no time to stand and stare.

    No time to stand beneath the boughs
    And stare as long as sheep or cows.

    No time to see, when woods we pass,
    Where squirrels hide their nuts in grass.

    No time to see, in broad daylight,
    Streams full of stars, like skies at night.

    No time to turn at Beauty's glance,
    And watch her feet, how they can dance.

    No time to wait till her mouth can
    Enrich that smile her eyes began.

    A poor life this if, full of care,
    We have no time to stand and stare.

    
    """
    cats1 ="""
    A cat can keep your house pest-free.
    """
    cats2 ="""
    A cat can make you smarter.  
    """
    cats3 ="""
    A cat can can Hear and smell — While they're sleeping.
    """
    cats4 ="""
    A cat can be very photogenic.
    """
    cats5 ="""
    A cat can help kids learn social skills.
    """
    cats6 ="""
    A cat can be an ideal pet for Apartments.
    """
    cats6 ="""
    A cat can be a great companion for seniors.
    """
    cats7 ="""
    A cat will wake you up when you need it.
    """
    cats8 ="""
    A cat is man's best friend.
    """
    cats9 ="""
    A cat is a great companion for kids.
    """

    sentences = [
    jabberwocky, best_of_times, last_dream, mystery, mark_twain_dog, einstein,
    tweedledee, goldens_1, goldens_2, goldens_3, dog_soul, keats, attention, backprop, lucy, full_of_cares,cats1,cats2,cats3,cats4,cats5,cats6,cats7,cats8,cats9
    ]
    embeddings = embedder.encode(sentences, convert_to_tensor=True)
    print(embeddings.shape)
    # print (f'{sentences[0]}  {embeddings[0]}')
    text = request.args.get('query')
    query = embedder.encode(text, convert_to_tensor=True)
    from sentence_transformers import util
    search_results = util.semantic_search(query, embeddings, top_k = 3)
    for index, result in enumerate(search_results[0]):
        print('-'*80)
        print(f'Search Rank: {index}, Relevance score: {result["score"]} ')
        print(sentences[result['corpus_id']])
    return jsonify(search_results,sentences)
    
@app.route('/text_image', methods=['GET'])
def text_image():
    text = request.args.get('query')
    from PIL import Image
    import glob
    import torch
    import pickle
    import zipfile
    import os
    from tqdm.autonotebook import tqdm
    from sentence_transformers import SentenceTransformer, util
    torch.set_num_threads(4)
    
    model = SentenceTransformer('clip-ViT-B-32')
    use_precomputed_embeddings = True

    if use_precomputed_embeddings:
        emb_filename = 'unsplash-25k-photos-embeddings.pkl'
        if not os.path.exists(emb_filename):  # Download dataset if does not exist
            util.http_get('http://sbert.net/datasets/' + emb_filename, emb_filename)

        with open(emb_filename, 'rb') as fIn:
            img_names, img_emb = pickle.load(fIn)
        print("Images:", len(img_names))
    else:
        img_names = list(glob.glob('unsplash/photos/*.jpg'))
        print("Images:", len(img_names))
        img_emb = model.encode([Image.open(filepath) for filepath in img_names],
                               batch_size=128,
                               convert_to_tensor=True,
                               show_progress_bar=True)
    
    from typing import Union
    query = text
    is_image: bool = False
    k: int = 8
    raw = Image.open(query) if is_image else query
    query_emb = model.encode([raw], convert_to_tensor=True, show_progress_bar=False)
    hits = util.semantic_search(query_emb, img_emb, top_k=k)[0]
    
    print("Query:")
    raw.show() if is_image else print(query)
    img_folder = 'photos/'
    images = [os.path.join(img_folder, img_names[hit['corpus_id']]) for hit in hits]
    # images = [os.path.join(os.path.dirname(__file__), img_names[hit['corpus_id']]) for hit in hits]
    print(images)
    print(len(images))
    return jsonify(images)


   