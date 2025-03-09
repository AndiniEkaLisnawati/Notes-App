const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/script.js', // Path ke file JavaScript utama
  output: {
    filename: 'bundle.js', // Nama file output
    path: path.resolve(__dirname, 'dist'), // Direktori output
    clean: true, // Membersihkan direktori output sebelum build
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Aturan untuk file CSS
        use: ['style-loader', 'css-loader'], // Loader untuk CSS
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Template HTML
      filename: 'index.html', // Nama file output HTML
    }),
  ],
  devtool: 'inline-source-map', // Untuk debugging
  devServer: {
    static: './dist', // Direktori untuk melayani file statis
    hot: true,
    roxy: {
      '/v2': {
        target: 'https://notes-api.dicoding.dev',
        secure: false,
        changeOrigin: true,
      },
    }, // Mengaktifkan hot module replacement
  },
  mode: 'development', // Mode pengembangan
};