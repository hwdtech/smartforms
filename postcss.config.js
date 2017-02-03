module.exports = {
  plugins: [
    require('postcss-assets')({
      loadPaths: ['frontend/images']
    }),
    require('postcss-custom-media')({
      extensions: {
        '--phone': '(min-width: 420px)',
        '--tablet': '(min-width: 768px)',
        '--desktop': '(min-width: 992px)'
      }
    }),
    require('autoprefixer')({ browsers: '> 1%' }),
    require('precss'),
    require('postcss-calc')
  ]
};
