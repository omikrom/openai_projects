import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const username = req.body.username || '';
  const keyword = req.body.keyword || '';

  if (username.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid username",
      }
    });
    return;
  }

  if (keyword.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid keyword",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePeom(username, keyword),
      temperature: 0.6,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });


    const imgCompletion = await openai.createImage({
      prompt: generateImage(keyword),
      n: 1,
      size: '1024x1024',
    });

    let imgUrl = imgCompletion.data.data[0].url;

    res.status(200).json({
      result: completion.data.choices[0].text,
      imageUrl: imgUrl
    });

  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generateImage(keyword) {
  return `Create an astounding, landscape or spacescape painting with a captivating anime inspired artwork using these keywords: ${keyword} as the inspiration. do not use text.`
}

function generatePeom(username, keyword) {
  return `Write a poem about ${username} which discusses the topic of ${keyword}`
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
