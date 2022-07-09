
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily:{
        body:["Poppins"]
      },
      colors:{
        primary: 'rgba(20,203,227,1)',
        danger:'rgba(235,77,75,10)',
        secondary:'rgba(44,45,81,1)',
        light:'#F1F1FB',
        fontColor:'#747399'
      },
      backgroundImage:{
        bgGrad:'linear-gradient(to right, #fc00ff 0%, #00dbde  51%, #fc00ff  100%)'
      }
    },
  },
  plugins: [],
}
