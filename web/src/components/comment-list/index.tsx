import React from 'react';
import { Divider, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';

interface Props {
  comments: Array<any>
}

const useStyles = makeStyles({
  root: {
    minWidth: 400,
    marginTop: 30
  },
  inline: {
    display: 'inline',
  },
});

const CommentList: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {props.comments.map((comment, index: number) => {
        return (
          <ListItem alignItems="flex-start" key={`comment-${index}`} id={`comment-${index}`}>
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
            <Divider variant="middle" />
          </ListItem>
        );
      })}
    </List>
  );
};

export default CommentList;
