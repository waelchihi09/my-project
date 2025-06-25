import React from "react";
import { Paper, List, ListItem, ListItemText, Typography } from "@mui/material";

const SecretList = ({ secrets }) => {
  if (!secrets.length) {
    return <Typography variant="body1">لا توجد أسرار بعد 🙁</Typography>;
  }
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        قائمة الأسرار
      </Typography>
      <List>
        {secrets.map((secret) => (
          <ListItem key={secret._id} divider>
            <ListItemText
              primary={secret.text}
              secondary={new Date(secret.createdAt).toLocaleString("ar-EG")}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SecretList;