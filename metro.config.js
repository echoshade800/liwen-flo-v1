const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper resolver configuration for Android
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;