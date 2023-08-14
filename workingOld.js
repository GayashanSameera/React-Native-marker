import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
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

export default function WorkingOld() {
    const anchorRef = useRef(null);
    const newDragRef = useRef(null);
    const editDragRef = useRef(null);

    const [dropPin, setDropPin] = useState(false);
    const [wrapperYValue, setWrapperYValue] = useState(null);
    const [wrapperXValue, setWrapperXValue] = useState(null);
    const [pins, setPins] = useState([]);
    const [activePin, setActivePin] = useState({});
    const [activeNewDraggable, setActiveNewDraggable] = useState(true);
    const [activeEditDraggable, setActiveEditDraggable] = useState(false);
    const [currentDraggerPosition, setCurrentDraggerPosition] = useState({ x: 50, y: 50 });
    const [activeNewDraggableId, setActiveNewDraggableId] = useState(null);

    useEffect(() => {
        if (anchorRef?.current) {
            anchorRef.current.measureInWindow((x, y, width, height) => {
                setWrapperYValue(y);
                setWrapperXValue(x);
            });
        }
    });

    const savePin = () => {
        setActiveNewDraggable(false);
        setActiveNewDraggableId(null);
        setDropPin(false);
        setActivePin({});
        setTimeout(() => {
            setActiveNewDraggable(true);
        }, 100);
    };

    const releaseDrag = (action) => {
        const reference = action === 'edit' ? editDragRef : newDragRef;
        if (reference?.current) {
            reference.current.measureInWindow((x, y, width, height) => {
                setActiveNewDraggable(false);
                setActiveEditDraggable(false);
                setActiveNewDraggableId(null);
                
                const preArray = cloneDeep(pins);
                const id = activePin?.id || (preArray?.length || 0) + 1;
                preArray.push({ x: x - wrapperXValue, y: y - wrapperYValue, id });
                setPins(preArray);
                setActivePin({ x: x - wrapperXValue, y: y - wrapperYValue, id });
                setDropPin(true);
            });
        }
    };

    const onPressSavedPin = (item) => {
        setActiveEditDraggable(true);
        setActiveNewDraggable(false);
        setDropPin(true);
        setActiveNewDraggableId(item.id);
        const copiedPins = cloneDeep(pins);
        const newSavedPins = copiedPins.filter((i) => i.id !== item.id);
        setPins([...newSavedPins]);
        setActivePin(item);
        setCurrentDraggerPosition({ x: item.x, y: item.y });
    };

    const up = () => {
        const copiedPins = cloneDeep(pins);
        activePin.y = activePin.y - 8;

        const activeIndex = copiedPins.findIndex((i) => i.id === activePin.id);
        copiedPins[activeIndex] = activePin;
        setPins(copiedPins);
        setCurrentDraggerPosition({ x: activePin.x, y: activePin.y });
    };

    const down = () => {
        const copiedPins = cloneDeep(pins);
        activePin.y = activePin.y + 8;

        const activeIndex = copiedPins.findIndex((i) => i.id === activePin.id);
        copiedPins[activeIndex] = activePin;
        setPins(copiedPins);
        setCurrentDraggerPosition({ x: activePin.x, y: activePin.y });
    };

    const left = () => {
        const copiedPins = cloneDeep(pins);
        activePin.x = activePin.x - 8;

        const activeIndex = copiedPins.findIndex((i) => i.id === activePin.id);
        copiedPins[activeIndex] = activePin;
        setPins(copiedPins);
        setCurrentDraggerPosition({ x: activePin.x, y: activePin.y });
    };

    const right = () => {
        const copiedPins = cloneDeep(pins);
        activePin.x = activePin.x + 8;

        const activeIndex = copiedPins.findIndex((i) => i.id === activePin.id);
        copiedPins[activeIndex] = activePin;
        setPins(copiedPins);
        setCurrentDraggerPosition({ x: activePin.x, y: activePin.y });
    };

    const deleteItem = () => {
        const copiedPins = cloneDeep(pins);
        const newPins = copiedPins.filter((i) => i.id !== activePin.id);
        
        setPins(newPins);
        setActiveNewDraggable(true);
        setActiveNewDraggableId(null);
        setDropPin(false);
        setActivePin({});
        setActiveEditDraggable(false);
    }

    const dragStart = (id) => {
        setActiveNewDraggableId(id);
    };

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

                {pins?.length > 0
                    ? pins.map((i,index) => (
                          <TouchableOpacity
                            key={index}
                              onPress={() => onPressSavedPin(i)}
                              style={[styles.pinWrapper, styles.surveyTablePopUp, { top: i.y, left: i.x }]}
                              onLongPress={() => onPressSavedPin(i)}
                              onPressOut={() => onPressSavedPin(i)}
                          >
                              <Pin />
                          </TouchableOpacity>
                      ))
                    : null}

                {activeEditDraggable && (
                    <Draggable x={currentDraggerPosition.x} y={currentDraggerPosition.y} onDragRelease={() => releaseDrag('edit')}>
                        <View style={[styles.pinWrapper]} ref={newDragRef} >
                            <Pin dragging={activeNewDraggableId > 0 } />
                        </View>
                    </Draggable>
                )}
            </View>
            <View style={[ activeNewDraggable && styles.initialWrapper]} >
                {activeNewDraggable && (
                    <Draggable x={20} y={0} onDragRelease={releaseDrag} onDrag={() => dragStart(-1)}>
                        <View style={[styles.pinWrapper]} ref={newDragRef}>
                            <Pin dragging={activeNewDraggableId === -1} />
                        </View>
                    </Draggable>
                )}
            </View>
            <View>
                {dropPin && (
                    <View>
                        <TouchableOpacity onPress={savePin} style={styles.buttonWrapper}>
                            <Text>SAVE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deleteItem} style={styles.buttonWrapper}>
                            <Text>DELETE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={up} style={styles.buttonWrapper}>
                            <Text>UP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={down} style={styles.buttonWrapper}>
                            <Text>DOWN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={left} style={styles.buttonWrapper}>
                            <Text>LEFT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={right} style={styles.buttonWrapper}>
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
        margin: 100,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        height: 850,
    },
    imageWrapper: {
        borderColor: "#0a0a0a",
        borderWidth: 2,
        width: 650,
        height: 650,
    },
    buttonWrapper: {
        borderColor: "#0a0a0a",
        borderWidth: 2,
        marginTop: 10,
        borderRadius: 10,
        width: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    pinTop: {
        backgroundColor: "#eb4034",
        borderColor: "#eb4034",
        borderWidth: 5,
        borderRadius: 100,
        minHeight: 5,
        elevation: 10,
        shadowColor: "rgba(235, 50, 50, 50)",
        shadowOffset: { width: 20, height: 40 },
        shadowRadius: 20,
        maxWidth: 5,
    },
    pinBottom: {
        backgroundColor: "#eb4034",
        borderColor: "#eb4034",
        borderWidth: 1.5,
        minHeight: 15,
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
    initialWrapper : {
        height: 60,
        width: 60,
        borderColor: "#0a0a0a",
        borderWidth: 5,
        borderRadius: 100,
        top: 80,
        left: 30
    }
});
