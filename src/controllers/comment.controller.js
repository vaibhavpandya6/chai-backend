import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    const aggregateQuery = Comment.aggregate([
      { $match: { video: new mongoose.Types.ObjectId(videoId) } }
    ]);     

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await Comment.aggregatePaginate(aggregateQuery, options);
    
     return res.status(200).json(new ApiResponse(
         200,
         result,"Comments fetched successfully"
     ))

    

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

  const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    });

    if (!comment) {
        throw new ApiError(500, "Failed to add comment please try again");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params;
    const {content} = req.body;
    const owner = req.user?._id

    if( !content ){
        throw new ApiError(400, " text is required")
    }
    
    const comment = await Comment.findById(commentId);

    if (!comment ){
        throw new ApiError(404, "Comment not found")
    }

    if(owner.toString() !== comment?.owner.toString()){
        throw new ApiError(400, "only comment owner can edit their comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        comment?._id,
        {
            $set:{
                content: content 
            }
        },
        { new:true }
    );

      if (!updatedComment) {
        throw new ApiError(500, "Failed to edit comment please try again");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedComment, "Comment edited successfully")
        );

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const {content} = req.body

     if( !content ){
        throw new ApiError(400, " text is required")
    }
    

    const comment = await Comment.findById(commentId)

    
    if(req.user?._id.toString() !==  comment?.owner._id.toString()){
       throw new ApiError(400, "only comment owner can delete their comment");
    }
    
    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(new
        ApiResponse(200, { commentId }, "Comment deleted successfully")
    )




})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }