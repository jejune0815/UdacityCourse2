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

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  // testImage: https://www.litter.me/wp/wp-content/uploads/2020/09/DJI_0094-scaled.jpg
  app.get("/FilteredImage", async (req, res) => {
      const sourceImageUrl = req.query.imageUrl;

      if (!sourceImageUrl) {
        res.status(404).send({status: "Error",message: "Please provide valid imnageUrl."});
        return;
      }
      
      var filteredImage = await filterImageFromURL(sourceImageUrl);

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