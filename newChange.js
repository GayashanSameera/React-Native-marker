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

export default function NewChange() {
    const anchorRef = useRef(null);
    const newDragRef = useRef(null);
    
    const [editDragRef, setEditDragRef] = useState([]);
    const [dropPin, setDropPin] = useState(false);
    const [wrapperYValue, setWrapperYValue] = useState(null);
    const [wrapperXValue, setWrapperXValue] = useState(null);
    const [pins, setPins] = useState([]);
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

                setPins(cloneDeep(preArray));
                setActiveNewDraggableId(null);
                setActiveNewDraggable(false);
                setActivePin(newActiveDrag);
                setDropPin(true);
            });
        }
    };

    const releaseEditDrag = (item, index, changing) => {
        // console.log('editDragRef',editDragRef);
        const preArrayy = cloneDeep(pins);
        preArrayy[index] = {
            ...preArrayy?.[index],
            x: preArrayy?.[index]?.x + changing?.dx,
            y: preArrayy?.[index]?.y + changing?.dy,
        }
        console.log('x',preArrayy?.[index]?.x + changing?.dx);
        console.log('Y',preArrayy?.[index]?.y + changing?.dy);
        setPins(preArrayy);
        
        // if (editDragRef?.[index]?.current) {
        //     editDragRef?.[index].current.measureInWindow((x, y, width, height) => {
        //         const preArray = cloneDeep(pins);
        //         preArray[index].x = x - wrapperXValue;
        //         preArray[index].y = y - wrapperYValue;
        //         console.log('preArray[index].x',preArray[index].x);
        //         console.log('preArray?.[index]?.y ',preArray?.[index]?.y );
        //         setActiveNewDraggableId(null);
        //         setActiveNewDraggable(false);
        //         setPins(preArray);
        //         setActivePin({ x: x - wrapperXValue, y: y - wrapperYValue, id: preArray[index].id });
        //         setDropPin(true);
        //     });
        // }
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
                    ? pins.map((i, index) => (
                          <Draggable
                            key={index}
                              x={i.x}
                              y={i.y}
                              onDrag={(event, changing) => dragStart(i.id)}
                              onDragRelease={(event, changing) => releaseEditDrag(i, index, changing)}
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
                    <Draggable x={50} y={50} onDragRelease={releaseDrag} onDrag={() => dragStart(-1)}>
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
