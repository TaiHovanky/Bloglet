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
      {props.comments.map((comment) => {
        return (
          <>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {`${comment.user.firstName} ${comment.user.lastName}`}
                    </Typography>
                    <div>
                      {comment.comment}
                    </div>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="middle" component="li" />
          </>
        );
      })}
    </List>
  );
};

export default CommentList;
