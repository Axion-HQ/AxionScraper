import { MongoClient, ServerApiVersion} from 
"mongodb";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

// NOTE: Create a MongoClient with a "MongoClientOptions" object to set the Stable API version.
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		await client.connect();
		await client.db("admin").command({ ping: 1 });

        co
	} catch (e) {
        console.log(`${chalk.bgRed.bold.black("[ ERROR ]")}: ${chalk.red.bold(e)}`);
    } 
    
    
    finally {
		await client.close();

	}
}
run().catch(console.dir);


export default {
	client,
	run
}

// TODO: This Could Be Scraped, Since we are using Mongoose.
