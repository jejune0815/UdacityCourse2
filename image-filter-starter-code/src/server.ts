import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // testImage: https://www.litter.me/wp/wp-content/uploads/2020/09/DJI_0094-scaled.jpg
  app.get("/FilteredImage", async (req:express.Request, res:express.Response) => {
      const sourceImageUrl:string = req.query.imageUrl;

      if (!sourceImageUrl) {
        res.status(404).send({status: "Error",message: "Please provide valid imnageUrl."});
        return;
      }
      
      const filteredImage:string = await filterImageFromURL(sourceImageUrl);

      if (!filteredImage) {
        res.status(500).send({status: "Error",message: "Image conversion failed."});
        return;
      }

      res.sendFile(filteredImage);
      res.on("finish", function() {deleteLocalFiles([filteredImage]);});
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /FilteredImage?imageUrl={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();