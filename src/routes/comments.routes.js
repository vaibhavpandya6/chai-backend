import { Router } from "express";
import {  getVideoComments, 
    addComment, 
    updateComment,
     deleteComment} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router  = Router();
router.use(verifyJWT, upload.none()); 
// // Apply verifyJWT middleware to all routes in this file // 

//upload.none() is used when the frontend sends form-data without files.

//express.json() or express.urlencoded() is used when frontend sends JSON or URL-encoded data

router.route("/:videoId").get(getVideoComments).post(verifyJWT,addComment);
router.route("/c/:commentId").delete(verifyJWT,deleteComment).patch(verifyJWT,updateComment);



export default router;