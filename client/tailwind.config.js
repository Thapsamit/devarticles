
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily:{
        body:["Poppins"]
      },
      colors:{
        lightBg:'#2D3748',
        darkBg:'#1A212D',
        mainColor:'#3182ED',
        fontDark:'#2D3748',
        primaryText1:'#728197',
        primaryText2:'#A0AEC0',
        primaryText3:'#CCD6E0',
        primaryText4:'#EDF2F7',
        primary: 'rgba(20,203,227,1)',
        danger:'rgba(235,77,75,10)',
        secondary:'rgba(44,45,81,1)',
        light:'#F1F1FB',
        fontColor:'#747399',
        clearBtn:"#9D8F0F"
      },
      backgroundImage:{
        bgGrad:'linear-gradient(to right, #fc00ff 0%, #00dbde  51%, #fc00ff  100%)'
      }
    },
  },
  plugins: [],
}
