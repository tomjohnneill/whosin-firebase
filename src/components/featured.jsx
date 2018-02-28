import React from 'react';

export default class Featured extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
        <h1 style={{textAlign: 'center', fontSize: '30px', marginBottom: '10px'}}>
          Our Featured Projects
        </h1>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '45px'}}>
          <div style={{width: '40px', height: '1px', backgroundColor: '#FF9800'}}/>
        </div>
        <div style={{width:'100%', maxWidth: '1400px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '20px'}}>
          <span style={{height: '300px', width: '20%',
            backgroundImage: 'https://lonelyplanetimages.imgix.net/mastheads/283389.jpg?h=455&rect=1003,0,1348,1999&sharp=10&vib=20&w=300',
            backgroundSize: 'cover'

          }}>
            
          </span>
          <span style={{height: '300px', width: '20%'}}>
            <img src='https://lonelyplanetimages.imgix.net/mastheads/283389.jpg?h=455&rect=1003,0,1348,1999&sharp=10&vib=20&w=300'
              style={{height: '100%', width: '100%', objectFit: 'cover'}}/>
          </span>
          <span style={{height: '300px', width: '20%'}}>
            <img src='https://lonelyplanetimages.imgix.net/mastheads/283389.jpg?h=455&rect=1003,0,1348,1999&sharp=10&vib=20&w=300'
              style={{height: '100%', width: '100%', objectFit: 'cover'}}/>
          </span>
          <span style={{height: '300px', width: '20%'}}>
            <img src='https://lonelyplanetimages.imgix.net/mastheads/283389.jpg?h=455&rect=1003,0,1348,1999&sharp=10&vib=20&w=300'
              style={{height: '100%', width: '100%', objectFit: 'cover'}}/>
          </span>
        </div>
      </div>
    )
  }
}
