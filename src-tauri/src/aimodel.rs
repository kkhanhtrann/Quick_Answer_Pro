use reqwest::Client;
use serde::{Deserialize, Serialize};

pub struct AIModel {
    vision_client: Client,
    api_key: String,
}

impl AIModel {
    // Constructor for AIModel, initializing the HTTP client and storing the API key
    pub fn new(api_key: String) -> Self {
        let vision_client = Client::new();
        Self {
            vision_client,
            api_key,
        }
    }

    // Asynchronously analyzes an image using the GPT-4 model by sending a POST request
    pub async fn analyze_image(
        &self,
        prompt: &str,
        image_base64: &str,
    ) -> Result<String, Box<dyn std::error::Error>> {
        
        // Enum for the content type
        #[derive(Serialize)]
        #[serde(untagged)]
        enum ContentType {
            Text(TextContentType),
            ImageUrl(ImageContentType),
        }
        #[derive(Serialize)]
        struct TextContentType {
            #[serde(rename = "type")]
            kind: String,
            text: String,
        }

        #[derive(Serialize)]
        struct ImageContentType {
            #[serde(rename = "type")]
            kind: String,
            image_url: ImageUrl,
        }

        #[derive(Serialize)]
        struct ImageUrl {
            url: String,
        }

        // Struct for the JSON request payload
        #[derive(Serialize)]
        struct ChatCompletionRequest {
            model: String,
            messages: Vec<Message>,
        }

        // Struct for individual messages within the request payload
        #[derive(Serialize)]
        struct Message {
            role: String,
            content: Vec<ContentType>,
        }

        // Struct for the JSON response payload
        #[derive(Deserialize)]
        struct ChatCompletionResponse {
            choices: Vec<Choice>,
        }

        // Struct for individual choices within the response payload
        #[derive(Deserialize)]
        struct Choice {
            message: MessageContent,
        }

        // Struct for the message content within a choice
        #[derive(Deserialize)]
        struct MessageContent {
            content: String,
        }

        // Constructing the messages vector
        let messages = vec![Message {
            role: "user".to_string(),
            content: vec![
                ContentType::Text(TextContentType {
                    kind: "text".to_string(),
                    text: prompt.to_string(),
                }),
                ContentType::ImageUrl(ImageContentType {
                    kind: "image_url".to_string(),
                    image_url: ImageUrl {
                        url: format!("data:image/jpeg;base64,{}", image_base64),
                    },
                }),
            ],
        }];
        // Creating the request payload
        let request = ChatCompletionRequest {
            model: "gpt-4o".to_string(), // Ensure you use the correct model capable of vision
            messages,
        };

        // Sending the POST request to the OpenAI API
        let response = self
            .vision_client
            .post("https://api.openai.com/v1/chat/completions".to_string())
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&request)
            .send()
            .await?;

        let response_json: ChatCompletionResponse = response.json().await?;

        // Concatenate all choices into a single string
        let result = response_json
            .choices
            .iter()
            .map(|choice| choice.message.content.clone())
            .collect::<Vec<String>>()
            .join(" ");

        Ok(result)
    }
}
