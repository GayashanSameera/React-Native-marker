import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { LineChart as WLinechart } from 'react-native-charts-wrapper';
import moment from 'moment';
export default function Charts(props){
    
    return(
        <View style={[ {height: 550, } ]}>
            <WLinechart
            style={[{flex: 1}]}
            data={{dataSets:[
            {
            label: "demo", 
            values: [
              {x: 0, y: 5, marker: "10:55: 0W"},
              {x: 1604311200000- 1604310900000, y: 10, marker: "11:00: 0W"},
              {x: 1604311500000 - 1604310900000 , y: 5, marker: "11:05: 0W"}
            ]
            }]}}
            xAxis={{
                labelRotationAngle: 90,
                textSize:30,
                granularityEnabled: true,
                granularity: 1,
                valueFormatter: 'date',
                valueFormatterPattern: 'YYYY-MM-dd hh:mm a',
                timeUnit: 'MILLISECONDS',
                axisLineWidth: 0,
                position: 'BOTTOM',
                labelCount: 10,
                since: 1604310900000,
                drawGridLines: false
              }}

              yAxis={{
                left: {
                  axisLineWidth: 2,
                  gridDashedLine: {
                    lineLength: 25,
                    spaceLength: 25,
                  },
                  textSize: 10,
                  axisMinimum: 0,
                  axisMaximum: 12
                },
                right:{
                  enabled: false,
                }
              }} 
            />
            </View>
    );
}