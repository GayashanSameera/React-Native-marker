import React, { useRef, useEffect, useState, createRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from "react-native";
import Draggable from "react-native-draggable";
import cloneDeep from "lodash.clonedeep";

export function Pin(props) {
    return (
        <>
            {props.dragging ? (
                <ImageBackground
                    source={require("./vector.png")}
                    resizeMode="cover"
                    style={[{ width: 35, height: 35, alignItems: "center" }]}
                >
                    <View style={[{ paddingTop: 10, width: 35, height: 35, alignItems: "center" }]}>
                        <View style={[styles.pinTop]}></View>
                        <View style={[styles.pinBottom]}></View>
                    </View>
                </ImageBackground>
            ) : (
                <View style={[{ paddingTop: 10, width: 35, height: 35, alignItems: "center" }]}>
                    <View style={[styles.pinTop]}></View>
                    <View style={[styles.pinBottom]}></View>
                </View>
            )}
        </>
    );
}

export default function App() {
    const anchorRef = useRef(null);
    const newDragRef = useRef(null);
    
    const [editDragRef, setEditDragRef] = useState([]);
    const [dropPin, setDropPin] = useState(false);
    const [wrapperYValue, setWrapperYValue] = useState(null);
    const [wrapperXValue, setWrapperXValue] = useState(null);
    const [pins, setPins] = useState([]);
    const [tempPins, setTempPins] = useState([]);
    const [activePin, setActivePin] = useState({});
    const [activeNewDraggable, setActiveNewDraggable] = useState(true);
    const [activeNewDraggableId, setActiveNewDraggableId] = useState(null);

    useEffect(() => {
        if (anchorRef?.current) {
            anchorRef.current.measureInWindow((x, y, width, height) => {
                setWrapperYValue(y);
                setWrapperXValue(x);
            });
        }
    });

    useEffect(() => {
        setEditDragRef(pins.map(() => createRef()));
    },[pins]);

    const savePin = () => {
        console.log('pins',pins);
        const preArray = cloneDeep(pins);
        setTempPins(preArray);
        setActiveNewDraggable(false);
        setDropPin(false);
        setActivePin({});
        setTimeout(() => {
            setActiveNewDraggable(true);
        }, 100);
    };

    const releaseDrag = (event) => {
        if (newDragRef?.current) {
            newDragRef.current.measureInWindow((x, y, width, height) => {
                const preArray = cloneDeep(pins);
                const id = activePin?.id || (preArray?.length || 0) + 1;
                const newActiveDrag = { x: x - wrapperXValue, y: y - wrapperYValue, id };
                preArray.push(newActiveDrag);

                setTempPins(cloneDeep(preArray));
                setPins(cloneDeep(preArray));
                setActiveNewDraggableId(null);
                setActiveNewDraggable(false);
                setActivePin(newActiveDrag);
                setDropPin(true);
            });
        }
    };

    const releaseEditDrag = (item, index) => {
        console.log('editDragRef',editDragRef);
        if (editDragRef?.[index]?.current) {
            editDragRef?.[index].current.measureInWindow((x, y, width, height) => {
                const preArray = cloneDeep(pins);
                preArray[index].x = x - wrapperXValue+20;
                preArray[index].y = y - wrapperYValue+20;
                
                setActiveNewDraggableId(null);
                setActiveNewDraggable(false);
                setPins(preArray);
                setActivePin({ x: x - wrapperXValue, y: y - wrapperYValue, id: preArray[index].id });
                setDropPin(true);
            });
        }
    };

    const up = () => {
        const copiedPins =  cloneDeep(pins);
        activePin.y = activePin.y - 8;

        const activeIndex = copiedPins.findIndex((i) => i.id === activePin.id);
        copiedPins[activeIndex] = activePin;

        setActivePin(activePin);
        setPins(copiedPins);
    };

    const down = () => {
        const copiedPins =  cloneDeep(pins);
        activePin.y = activePin.y + 8;

        const activeIndex = copiedPins.findIndex((i) => i.id === activePin.id);
        copiedPins[activeIndex] = activePin;

        setActivePin(activePin);
        setPins(copiedPins);
    };

    const left = () => {
        const copiedPins =  cloneDeep(pins);
        activePin.x = activePin.x - 8;

        const activeIndex = copiedPins.findIndex((i) => i.id === activePin.id);
        copiedPins[activeIndex] = activePin;

        setActivePin(activePin);
        setPins(copiedPins);
    };

    const right = () => {
        const copiedPins =  cloneDeep(pins);
        activePin.x = activePin.x + 8;

        const activeIndex = copiedPins.findIndex((i) => i.id === activePin.id);
        copiedPins[activeIndex] = activePin;

        setActivePin(activePin);
        setPins(copiedPins);
    };

    const dragStart = (id) => {
        setActiveNewDraggableId(id);
    };
console.log('activeNewDraggableId',activeNewDraggableId);
console.log('tempPins',tempPins);
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

                {tempPins?.length > 0
                    ? tempPins.map((i, index) => (
                          <Draggable
                            key={index}
                              x={i.x}
                              y={i.y}
                              onPressIn={() => dragStart(i.id)}
                              onDragRelease={() => releaseEditDrag(i, index)}
                          >
                              <View style={[styles.pinWrapper]} ref={editDragRef[index]}>
                                  <Pin dragging={activeNewDraggableId === i.id} />
                              </View>
                          </Draggable>
                      ))
                    : null}
            </View>
            <View>
                {activeNewDraggable && (
                    <Draggable x={50} y={50} onDragRelease={releaseDrag} onPressIn={() => dragStart(-1)}>
                        <View style={[styles.pinWrapper]} ref={newDragRef}>
                            <Pin dragging={activeNewDraggableId === -1} />
                        </View>
                    </Draggable>
                )}
            </View>
            <View>
                {dropPin && (
                    <View>
                        <TouchableOpacity onPress={savePin}>
                            <Text>SAVE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={up}>
                            <Text>UP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={down}>
                            <Text>DOWN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={left}>
                            <Text>LEFT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={right}>
                            <Text>RIGHT</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 200,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    imageWrapper: {
        borderColor: "#0a0a0a",
        borderWidth: 2,
    },
    pinTop: {
        backgroundColor: "#eb4034",
        borderColor: "#eb4034",
        borderWidth: 8,
        borderRadius: 100,
        minHeight: 8,
        elevation: 10,
        shadowColor: "rgba(235, 50, 50, 50)",
        shadowOffset: { width: 20, height: 40 },
        shadowRadius: 20,
        maxWidth: 8,
    },
    pinBottom: {
        backgroundColor: "#eb4034",
        borderColor: "#eb4034",
        borderWidth: 1.5,
        minHeight: 22,
        elevation: 10,
        shadowColor: "rgba(235, 50, 50, 50)",
        shadowOffset: { width: 20, height: 40 },
        shadowRadius: 20,
        maxWidth: 1,
    },
    pinWrapper: {
        alignItems: "center",
        minHeight: 15,
        maxWidth: 5,
        elevation: 10,
    },
    imageStyles: {
        width: 600,
        height: 600,
    },
    surveyTablePopUp: {
        alignItems: "center",
        position: "absolute",
    },
    alignItemCenter: {
        alignItems: "center",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    draggable: {
        width: 100,
        height: 100,
        backgroundColor: "blue",
    },
    receiver: {
        width: 100,
        height: 100,
        backgroundColor: "green",
    },
});
