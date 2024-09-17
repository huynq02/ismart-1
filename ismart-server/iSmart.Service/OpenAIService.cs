using OpenAI_API;
using OpenAI_API.Completions;
using System;
using System.Threading.Tasks;

namespace iSmart.Service
{
    public class OpenAIService
    {
        private readonly string _apiKey;

        public OpenAIService(string apiKey)
        {
            _apiKey = apiKey;
        }

        public async Task<string> GenerateReport(string prompt)
        {
            try
            {
                // Tạo đối tượng APIAuthentication từ API key
                APIAuthentication authentication = new APIAuthentication(_apiKey);

                // Khởi tạo OpenAIAPI với đối tượng authentication
                OpenAIAPI openAiApi = new OpenAIAPI(authentication);

                // Thiết lập các thông tin cho yêu cầu hoàn thành (CompletionRequest)
                string model = "gpt-3.5-turbo-1106";
                int maxTokens = 50;

                var completionRequest = new CompletionRequest
                {
                    Prompt = prompt,
                    Model = model,
                    MaxTokens = maxTokens
                };

                // Gọi phương thức CreateCompletionAsync để gửi yêu cầu và nhận kết quả
                var completionResult = await openAiApi.Completions.CreateCompletionAsync(completionRequest);

                // Lấy nội dung đã tạo từ kết quả hoàn thành
                var generatedText = completionResult.Completions[0].Text; // Lấy phần text từ lựa chọn đầu tiên

                return generatedText;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to generate report: {ex.Message}");
            }
        }
    }
}
