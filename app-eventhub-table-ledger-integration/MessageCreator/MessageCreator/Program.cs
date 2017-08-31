using System.Threading;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Security.Cryptography;

namespace MessageCreator
{
    class Program
    {
        private static string eventHubName = "xxx";
        private static string connectionString = "Endpoint=sb://xxx.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=xxx";

        public static void Main(string[] args)
        {
            Task.Run(async () =>
            {
                await SendingMessage();
            }).GetAwaiter().GetResult();
        }

        private static async Task<String> SendingMessage()
        {            
            var eventHubClient = EventHubClient.CreateFromConnectionString(connectionString, eventHubName);
            while (true)
            {
                try
                {
                    string response = await GetBitcoinPrice();
                    string message = messageCreator(response);
                    Console.WriteLine(message);
                    eventHubClient.Send(new EventData(Encoding.UTF8.GetBytes(message)));
                }
                catch (Exception exception)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("{0} > Exception: {1}", DateTime.Now, exception.Message);
                    Console.ResetColor();
                }
                Thread.Sleep(30000);
            }
        }

        private static async Task<String> GetBitcoinPrice()
        {
            string url = "https://api.coinmarketcap.com/v1/ticker/bitcoin/";
            string urlParameters = "?convert=EUR";

            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                using (HttpResponseMessage response = client.GetAsync(urlParameters).Result)
                {
                    using (HttpContent content = response.Content)
                    {
                        string responseString = await content.ReadAsStringAsync();
                        return responseString;
                    }
                }
            }
        }

        private static string messageCreator(string response)
        {
            dynamic responseJSON = JsonConvert.DeserializeObject(response);

            string id = responseJSON[0].id;
            string price_eur = responseJSON[0].price_eur;
            DateTime timestamp = DateTime.Now;
            string hashString = id + price_eur + timestamp;
            string hash = getHashSha256(hashString);

            responseJSON[0].hash = hash;
            responseJSON[0].timestamp = timestamp;

            string message = JsonConvert.SerializeObject(responseJSON);

            return message;
        }

        private static string getHashSha256(string text)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(text);
            SHA256Managed hashstring = new SHA256Managed();
            byte[] hash = hashstring.ComputeHash(bytes);
            string hashString = string.Empty;
            foreach (byte x in hash)
            {
                hashString += String.Format("{0:x2}", x);
            }
            return hashString;
        }

    }
}
