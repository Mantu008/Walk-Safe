import React, { useState } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import ButtonBase from "@mui/material/ButtonBase";
import CardMedia from "@material-ui/core/CardMedia";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import useStyles from "./styles";
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';
import { useNavigate } from 'react-router-dom';

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("profile"));
    const [likes, setLikes] = useState(post?.likes || []); // Default to an empty array
    const userId = user?.result.googleId || user?.result?._id;

    const handleLike = async () => {
        dispatch(likePost(post._id));
        if (likes.find((like) => like === userId)) {
            setLikes(likes.filter((id) => id !== userId));
        } else {
            setLikes([...likes, userId]);
        }
    };

    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === userId) ? (
                <>
                    <ThumbUpAltIcon fontSize="small" />
                    &nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? "s" : ""}`}
                </>
            ) : (
                <>
                    <ThumbUpAltOutlined fontSize="small" />
                    &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
                </>
            );
        }

        return (
            <>
                <ThumbUpAltOutlined fontSize="small" />
                &nbsp;Like
            </>
        );
    };

    const openPost = () => navigate(`/posts/${post._id}`);

    const renderMedia = () => {
        if (post.selectedFile?.includes("video")) {
            return (
                <video
                    controls
                    className={classes.media}
                    height="200"
                    src={post.selectedFile}
                    title={post.title}
                />
            );
        }
        return (
            <CardMedia
                component="img"
                height="200"
                image={post.selectedFile || "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"}
                title={post.title}
            />
        );
    };

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase
                component="span"
                name="test"
                className={classes.cardActions}
                onClick={openPost}
            >
                <CardContent>
                    {renderMedia()}
                    <div className={classes.overlay}>
                        <Typography variant="h6">{post.name}</Typography>
                        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                    </div>
                    {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                        <div className={classes.overlay2} name="edit">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentId(post._id);
                                }}
                                style={{ color: "white" }}
                                size="small"
                            >
                                <MoreHorizIcon fontSize="medium" />
                            </Button>
                        </div>
                    )}
                    <div className={classes.details}>
                        <Typography variant="body2" color="textSecondary" component="h2">
                            {post.tags.map((tag) => `#${tag} `)}
                        </Typography>
                    </div>
                    <Typography className={classes.title} gutterBottom variant="h5" component="h2">
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {post.message.split(" ").splice(0, 20).join(" ")}...
                    </Typography>
                </CardContent>
            </ButtonBase>

            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
                    <Likes />
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon fontSize="small" /> &nbsp; Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default Post;
