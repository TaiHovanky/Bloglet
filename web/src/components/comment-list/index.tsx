import React from 'react';
import { Grid, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import LikeButton from '../like-button';

interface Props {
  comments: Array<any>;
  likeComment: any;
  userId: number;
}

const useStyles = makeStyles({
  root: {
    minWidth: 400,
    marginTop: 30
  },
  inline: {
    display: 'inline',
  },
  likes: {
    marginBottom: 4
  }
});

const CommentList: React.FC<Props> = ({ comments, likeComment, userId }: Props) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {comments.map((comment, index: number) => {
        return (
          <ListItem alignItems="flex-start" key={`comment-${index}`} id={`comment-${index}`}>
            <Grid container spacing={2} className={classes.likes}>
              <Grid item xs={9}> 
                <ListItemText
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body1"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {`${comment.user.firstName} ${comment.user.lastName} `}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textSecondary"
                      >
                        {comment.comment}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <LikeButton userId={userId} item={comment} likeMutation={likeComment} />
              </Grid>
              <Grid item xs={1}>
                <Typography variant="h6" color="textSecondary">{comment.likes.length}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CommentList;
