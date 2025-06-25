import React, { useEffect, useState } from "react";
import SecretForm from "../components/SecretForm";
import SecretList from "../components/SecretList";
import { fetchSecrets, addSecret } from "../services/api";
import { Container, Typography, Box, Snackbar, Alert } from "@mui/material";

const Home = () => {
  const [secrets, setSecrets] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getSecrets = async () => {
    try {
      const { data } = await fetchSecrets();
      setSecrets(data);
    } catch (err) {
      setError("تعذر تحميل الأسرار!");
    }
  };

  useEffect(() => {
    getSecrets();
  }, []);

  const handleAddSecret = async (secret) => {
    try {
      await addSecret(secret);
      setSuccess("تمت إضافة السر بنجاح!");
      getSecrets();
    } catch (err) {
      setError("حدث خطأ أثناء إضافة السر!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🕵️‍♂️ Secret Share
        </Typography>
        <SecretForm onAdd={handleAddSecret} />
        <SecretList secrets={secrets} />
      </Box>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess("")}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;
<button className="button-modern">زر عصري</button>
