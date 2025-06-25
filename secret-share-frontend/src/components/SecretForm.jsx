import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";

const SecretForm = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await onAdd({ text });
    setText("");
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        أضف سرا جديدا
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="اكتب سرك هنا..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading || !text.trim()}>
          {loading ? "جاري الإرسال..." : "إضافة السر"}
        </Button>
      </form>
    </Paper>
  );
};

export default SecretForm;