module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    api: './src/api',
                    asset: './src/asset',
                    components: './src/components',
                    constants: './src/constants',
                    containers: './src/containers',
                    navigator: './src/navigator',
                    store: './src/store',
                    utils: './src/utils',
                    theme: './src/theme',
                }
            }
        ]
    ]
};
