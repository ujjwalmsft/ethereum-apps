using System;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace MessageCreator
{
    // <summary>
    /// Class to provide the interaction capabilities with the Table
    /// </summary>
    class TableInteraction
    {
        /// <summary>
        /// Method to interact with tables in Cosmos DB
        /// </summary>
        /// <param name="time">Time when price received</param>
        /// <param name="id">Currency type</param>
        /// <param name="price_eur">Price in Euro of the currency</param>
        /// <param name="hash">Hash of time, id and price_eur</param>
        public static void TableInsert(string time, string id, string price_eur, string hash)
        {
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=xxx;AccountKey=xxx;TableEndpoint=https://xxx.documents.azure.com:443/";
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

            TableInteraction tableInteractionInstance = new TableInteraction();

            Console.WriteLine("Creating Table if it doesn't exist...");

            CloudTable table = tableClient.GetTableReference("xxx");
            table.CreateIfNotExists();

            tableObject item = new tableObject()
            {
                PartitionKey = Guid.NewGuid().ToString(),
                RowKey = Guid.NewGuid().ToString(),
                Time = time.ToString(),
                Currency = id,
                Price = price_eur,
                Hash = hash
            };

            TableOperation insertOperation = TableOperation.Insert(item);
            table.Execute(insertOperation);
            Console.WriteLine("{0} > Write operation", time);
        }

        /// <summary>
        /// Class to provide the table entity to be stored in the table
        /// </summary>
        public class tableObject : TableEntity
        {
            public tableObject() { }

            public string Time { get; set; }

            public string Currency { get; set; }

            public string Price { get; set; }

            public string Hash { get; set; }
        }
    }
}
