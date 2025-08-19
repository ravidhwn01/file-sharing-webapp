import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast, List, ListItem, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';

function Download() {
  const [key, setKey] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleDownload = async () => {
    if (!key) {
      toast({ title: 'Please enter a key.', status: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/files/${key}`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
        if (data.files.length === 0) {
          toast({ title: 'No files found for this key.', status: 'info' });
        }
      } else {
        toast({ title: 'Failed to fetch files.', status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Error fetching files.', status: 'error' });
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <FormControl mb={4}>
        <FormLabel>Key</FormLabel>
        <Input value={key} onChange={e => setKey(e.target.value)} placeholder="Enter a key" />
      </FormControl>
      <Button colorScheme="teal" onClick={handleDownload} isLoading={loading} mb={4}>
        Get Files
      </Button>
      <List spacing={2}>
        {files.map((file, idx) => (
          <ListItem key={idx}>
            <Link href={`http://localhost:5000/download/${file._id}`} isExternal color="teal.500">
              {file.originalName}
            </Link>
          </ListItem>
        ))}
      </List>
    </motion.div>
  );
}

export default Download;
