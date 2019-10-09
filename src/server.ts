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

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {

    // validate the image_url query
    const { image_url } = req.query;
    if (!image_url) {
      return res.status(400).send("missing parameter image_url");
    }

    // call filterImageFromURL(image_url) to filter the image
    let filtered_image_filepath = await filterImageFromURL(image_url);
    if (!filtered_image_filepath) {
      return res.status(422).send("image not found or not processable");
    }

    // send the resulting file in the response
    res.status(200).contentType("image/jpeg").sendFile(filtered_image_filepath);

    // deletes any files on the server on finish of the response
    res.on("finish", (_: any) => {
      console.log(`on finish response event - delete image ${filtered_image_filepath}`);
      deleteLocalFiles([`${filtered_image_filepath}`]);
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
