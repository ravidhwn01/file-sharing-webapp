import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast, Progress, Stack } from '@chakra-ui/react';
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
      const res = await fetch('http://localhost:10000/upload', {
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
      <Stack spacing={4}>
        <FormControl>
          <FormLabel color={{ base: 'brand.500', _dark: 'white' }}>Key</FormLabel>
          <Input
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Enter a key"
            bg="whiteAlpha.800"
            _dark={{ bg: 'brand.600', color: 'white', borderColor: 'brand.400', _placeholder: { color: 'gray.300' } }}
            color={{ base: 'brand.500', _dark: 'white' }}
          />
        </FormControl>
        <FormControl>
          <FormLabel color={{ base: 'brand.500', _dark: 'white' }}>Files</FormLabel>
          <Box position="relative">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              bg="whiteAlpha.800"
              _dark={{ bg: 'brand.600', color: 'white', borderColor: 'brand.400' }}
              style={{
                padding: '8px 12px',
                height: 'auto',
                cursor: 'pointer',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '1rem',
                background: 'inherit',
              }}
              color={{ base: 'brand.500', _dark: 'white' }}
              _hover={{ borderColor: 'accent.400' }}
            />
          </Box>
        </FormControl>
        {uploading && <Progress size="sm" isIndeterminate />}
        <Button
          colorScheme="accent"
          onClick={handleUpload}
          isLoading={uploading}
          w="full"
          color={{ base: 'brand.500', _dark: 'white' }}
          _dark={{ bg: 'brand.400', color: 'white', _hover: { bg: 'brand.300' } }}
        >
          Upload
        </Button>
      </Stack>
    </motion.div>
  );
}

export default Upload;
