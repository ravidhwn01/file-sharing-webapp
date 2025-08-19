import React from 'react';
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Upload from './Upload';
import Download from './Download';

function App() {
  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Heading mb={6} textAlign="center">File Sharing App</Heading>
      </motion.div>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Upload</Tab>
          <Tab>Download</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Upload />
          </TabPanel>
          <TabPanel>
            <Download />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default App;
