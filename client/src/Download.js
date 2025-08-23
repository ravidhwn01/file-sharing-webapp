import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast, List, ListItem, Link, Alert, AlertIcon } from '@chakra-ui/react';
import { motion } from 'framer-motion';

function Download() {
  const [key, setKey] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();
  const handleDelete = async () => {
    if (!key) {
      toast({ title: 'Please enter a key.', status: 'warning' });
      return;
    }
    if (!window.confirm('Are you sure you want to delete all files for this key?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`https://file-sharing-webapp-1.onrender.com//files/${key}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setFiles([]);
        toast({ title: `Deleted ${data.deleted} file(s).`, status: 'success' });
      } else {
        toast({ title: 'Failed to delete files.', status: 'error' });
      }
    } catch (err) {
      toast({ title: 'Error deleting files.', status: 'error' });
    }
    setDeleting(false);
  };

  const handleDownload = async () => {
    if (!key) {
      toast({ title: 'Please enter a key.', status: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://file-sharing-webapp-1.onrender.com//files/${key}`);
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
        <FormLabel color={{ base: 'brand.500', _dark: 'white' }}>Key</FormLabel>
        <Input
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="Enter a key"
          color={{ base: 'brand.500', _dark: 'white' }}
          bg="whiteAlpha.800"
          _dark={{ bg: 'brand.600', color: 'white', borderColor: 'brand.400', _placeholder: { color: 'gray.300' } }}
        />
      </FormControl>
      <Button colorScheme="brand" onClick={handleDownload} isLoading={loading} mb={2} mr={2} color={{ base: 'brand.500', _dark: 'white' }} _dark={{ bg: 'brand.400', color: 'white', _hover: { bg: 'brand.300' } }}>
        Get Files
      </Button>
      <Button colorScheme="red" onClick={handleDelete} isLoading={deleting} mb={2} color={{ base: 'brand.500', _dark: 'white' }} _dark={{ bg: 'red.500', color: 'white', _hover: { bg: 'red.400' } }}>
        Delete All Files
      </Button>
      <List spacing={2}>
        {files.map((file, idx) => (
          <ListItem key={idx} display="flex" alignItems="center" justifyContent="space-between" color={{ base: 'brand.500', _dark: 'white' }}>
            <Box>
              <Link href={`https://file-sharing-webapp-1.onrender.com//download/${file._id}`} isExternal color={{ base: 'brand.400', _dark: 'accent.100' }}>
                {file.originalName}
              </Link>
            </Box>
            <Button size="xs" colorScheme="red" ml={2} color={{ base: 'brand.500', _dark: 'white' }} _dark={{ bg: 'red.500', color: 'white', _hover: { bg: 'red.400' } }}
              onClick={async () => {
                if (!window.confirm(`Delete file '${file.originalName}'?`)) return;
                try {
                  const res = await fetch(`https://file-sharing-webapp-1.onrender.com//file/${file._id}`, { method: 'DELETE' });
                  if (res.ok) {
                    setFiles(prev => prev.filter(f => f._id !== file._id));
                    toast({ title: `Deleted '${file.originalName}'.`, status: 'success' });
                  } else {
                    toast({ title: 'Failed to delete file.', status: 'error' });
                  }
                } catch (err) {
                  toast({ title: 'Error deleting file.', status: 'error' });
                }
              }}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </motion.div>
  );
}

export default Download;
