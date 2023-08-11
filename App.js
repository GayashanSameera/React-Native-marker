import React,{useRef, useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Draggable from 'react-native-draggable';

export default function App() {
  const anchorRef = useRef(null);
  const newDragRef = useRef(null);
  const [yvalue, setYvalue] = useState(null);
  const [dropPin, setDropPin] = useState(false);
  const [xvalue, setXvalue] = useState(null);
  const [pins, setPins] = useState([]);
  const [activePin, setActivePin] = useState({});
  const [activeNewDraggable, setActiveNewDraggable] = useState(true);

  useEffect(() => {
    if (anchorRef?.current) {
      anchorRef.current.measureInWindow((x, y, width, height) => {
        setYvalue(y);
        console.log('x',x);
        console.log('y',y);
        setXvalue(x)
      });
    }
  });

  const savePin = () => {
    setActiveNewDraggable(false);
    const preArray = [...pins];
    preArray.push(activePin);
    setPins(preArray);
    setDropPin(false);

    setTimeout(() => {
      setActiveNewDraggable(true);
    }, 100);
  }


  const releaseDrag = (event) => {
    if (newDragRef?.current) {
      newDragRef.current.measureInWindow((x, y, width, height) => {
        console.log('x>>>',x);
        console.log('xvalue',xvalue);
        console.log('y>>>',y);
        console.log('yvalue',yvalue);
        setActivePin({x : x - (xvalue) , y : y - (yvalue)});
        setDropPin(true);
      });
    }
  }
console.log('pins',pins);
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper} ref={anchorRef}>
        <Image source={require("./Screenshot.png")} style={styles.imageStyles} />
        {/* 400 400 */}
       {/* <View style={[styles.surveyTablePopUp, { top: 180 , left: 170}]} /> */}
       {/* 500 500 */}
       {/* <View style={[styles.surveyTablePopUp, { top: 230 , left: 220}]} /> */}
       {/* 600 600 */}
       {/* <View style={[styles.surveyTablePopUp, { top: 280 , left: 270}]} /> */}
       {/* <Draggable 
            x={200} y={300} renderColor='red' renderText='B'
            renderSize={80} 
            onDragRelease={releaseDrag}
            onLongPress={()=>console.log('long press')}
            onShortPressRelease={()=>console.log('press drag')}
            onPressIn={()=>console.log('in press')}
            onPressOut={()=>console.log('out press')}
        />   */}

        {
          pins?.length > 0 ? 
          (
            pins.map(i => (
                  <View style={[ styles.pinWrapper, styles.surveyTablePopUp, { top: i.y , left: i.x}]} >
                      <View style= {[styles.pinTop]}/>  
                      <View style= {[styles.pinBottom]}/>
                  </View>
            ))
          ):
          null
        }
        
     </View>
     <View>
      {
        activeNewDraggable && (
          <Draggable x={50} y={50} onDragRelease={releaseDrag}>
            <View style= {[styles.pinWrapper]} ref={newDragRef}>
                <View style= {[styles.pinTop]}></View> 
                <View style= {[styles.pinBottom]}></View> 
            </View> 
          </Draggable>
        )
      }
        
     </View>
     <View>
        {
          dropPin && (
            <TouchableOpacity onPress={savePin}><Text>SAVE</Text></TouchableOpacity>
          )
        }
     </View>
        
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:  200,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    borderColor: '#eb4034',
    borderWidth: 2
  },
  pinTop: {
    backgroundColor: '#eb4034',
    borderColor: '#eb4034',
    borderWidth: 5,
    borderRadius: 100,
    minHeight: 5,
    elevation: 10,
    shadowColor: 'rgba(235, 50, 50, 50)',
    shadowOffset: { width: 20, height: 40 },
    shadowRadius: 20,
    maxWidth: 5
  },
  pinBottom: {
    backgroundColor: '#eb4034',
    borderColor: '#eb4034',
    borderWidth: 1.5,
    minHeight: 15,
    elevation: 10,
    shadowColor: 'rgba(235, 50, 50, 50)',
    shadowOffset: { width: 20, height: 40 },
    shadowRadius: 20,
    maxWidth: 1
  },
  pinWrapper:{
    alignItems: 'center',
    minHeight: 15,
    maxWidth: 5,
    elevation: 10
  },
  imageStyles: {
    width: 600,
    height: 600
  },
  surveyTablePopUp: {
    alignItems: 'center',
    position: 'absolute',
  },
  alignItemCenter : {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
draggable: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
},
receiver: {
    width: 100,
    height: 100,
    backgroundColor: 'green',
},
});
