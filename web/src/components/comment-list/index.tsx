import React from 'react';
import { Grid, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import LikeButton from '../like-button';

interface Props {
  comments: Array<any>;
  likeComment: any;
}

const useStyles = makeStyles({
  root: {
    minWidth: 400
  },
  inline: {
    display: 'inline',
  },
  likes: {
    marginBottom: 4
  },
  commentCreatedAt: {
    display: 'block'
  }
});

const CommentList: React.FC<Props> = ({ comments, likeComment }: Props) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {comments.map((comment, index: number) => {
        return (
          <ListItem alignItems="flex-start" key={`comment-${index}`} id={`comment-${index}`}>
            <Grid container spacing={2} className={classes.likes}>
              <Grid item xs={10}> 
                <ListItemText
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="subtitle2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {comment && comment.user ? `${comment.user.firstName} ${comment.user.lastName} ` : ''}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                      >
                        {comment && comment.comment ? comment.comment : ''}
                      </Typography>
                      <span className={classes.commentCreatedAt}>
                        <Typography variant="caption">
                          {comment ? comment.createdAt : ''}
                        </Typography>
                      </span>
                    </React.Fragment>
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <LikeButton item={comment} likeMutation={likeComment} />
              </Grid>
              <Grid item xs={1}>
                <Typography variant="subtitle1" color="textSecondary">{comment && comment.likes ? comment.likes.length : 0}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CommentList;
