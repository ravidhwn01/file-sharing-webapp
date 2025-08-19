import React from 'react';
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, extendTheme, ChakraProvider, useColorMode, IconButton, Flex } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
// Custom Chakra UI theme: dark blue and white
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark'
          ? 'linear-gradient(135deg, #0a2342 0%, #19376d 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #e3eafc 100%)',
        minHeight: '100vh',
      },
    }),
  },
  colors: {
    brand: {
      50: '#e3eafc',
      100: '#b6c6e6',
      200: '#7a9cd6',
      300: '#3d6fc3',
      400: '#19376d',
      500: '#0a2342',
      600: '#081a31',
      700: '#061221',
      800: '#040a11',
      900: '#020509',
    },
    accent: {
      50: '#ffffff',
      100: '#f7fafc',
      200: '#edf2f7',
      300: '#e2e8f0',
      400: '#cbd5e1',
      500: '#a0aec0',
      600: '#718096',
      700: '#4a5568',
      800: '#2d3748',
      900: '#1a202c',
    },
  },
});

function ColorModeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="Toggle dark mode"
      icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      position="absolute"
      top={4}
      right={4}
      zIndex={10}
    />
  );
}
import { motion } from 'framer-motion';
import Upload from './Upload';
import Download from './Download';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" position="relative" py={20}>
        <ColorModeSwitcher />
        <Box maxW="lg" mx="auto" p={8} borderWidth={1} borderRadius="2xl" boxShadow="2xl" bg={{ base: 'white', _dark: 'brand.500' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Heading mb={6} textAlign="center" color={{ base: 'brand.500', _dark: 'accent.100' }}>Now I Can Share files </Heading>
          </motion.div>
          <Tabs isFitted variant="enclosed-colored" colorScheme="brand">
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
        <Box textAlign="center" mt={8} color={{ base: 'brand.500', _dark: 'accent.100' }} fontSize="md">
          Made With <span role="img" aria-label="love">❤️</span> By R.K. Dhawan
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
