import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';

function Upload() {
  const [files, setFiles] = useState([]);
  const [key, setKey] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!key || files.length === 0) {
      toast({ title: 'Please enter a key and select files.', status: 'warning' });
      return;
    }
    setUploading(true);
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    formData.append('key', key);
    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        toast({ title: 'Files uploaded successfully!', status: 'success' });
        setFiles([]);
        setKey('');
      } else {
        toast({ title: 'Upload failed.', status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Error uploading files.', status: 'error' });
    }
    setUploading(false);
    setProgress(0);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <FormControl mb={4}>
        <FormLabel>Key</FormLabel>
        <Input value={key} onChange={e => setKey(e.target.value)} placeholder="Enter a key" />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Files</FormLabel>
        <Input type="file" multiple onChange={handleFileChange} />
      </FormControl>
      {uploading && <Progress size="sm" isIndeterminate mb={2} />}
      <Button colorScheme="teal" onClick={handleUpload} isLoading={uploading}>
        Upload
      </Button>
    </motion.div>
  );
}

export default Upload;
