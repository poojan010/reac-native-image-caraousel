import ImageColors from 'react-native-image-colors'
import React, { useCallback, useRef, useState, FC, useEffect, useMemo } from "react";
import { FlatList, View, Dimensions, StyleSheet, Image, ImageStyle, ViewStyle } from "react-native";


const { width: windowWidth, height: windowHeight } = Dimensions.get("window");


const IMAGE_WIDTH = windowWidth - 20
const defaultBg = "#ffffff"
const colorConfig = { fallback: '#ffffff', cache: true }

// This variable ensures that Height of the Image do not exceed certain amount
const maximumMinAspectRatioAllowed = (IMAGE_WIDTH / windowHeight) * 1.75

interface Props {
    data: Array<string>
}

const ImageSlide = ({ image, aspectRatio }: any) => {

    const imageSource = { uri: image }

    const [bgColor, setBgColor] = useState(defaultBg)

    const fetchBgColor = async () => {

        const result = await ImageColors.getColors(image, colorConfig)

        if (result.platform === 'ios')
            setBgColor(result.primary)
        else if (result.platform === 'android')
            setBgColor(result.average ? result.average : defaultBg)

    }
    useEffect(() => { fetchBgColor() }, [image])

    const imagStyle: ImageStyle = useMemo(() => {
        return {
            width: "100%",
            height: undefined,
            resizeMode: 'contain',
            aspectRatio: Math.max(aspectRatio, maximumMinAspectRatioAllowed)
        }
    }, [aspectRatio])

    const slideViewStyle: ViewStyle = useMemo(() => {
        return {
            ...styles.slide,
            backgroundColor: bgColor
        }
    }, [bgColor])


    return (
        <View style={slideViewStyle}>
            <Image
                style={imagStyle}
                source={imageSource}
            />
        </View>
    );
};


const Pagination = ({ index, data }: any) => {
    return (
        <View style={styles.pagination} pointerEvents="none">
            {data.map((_: any, i: any) => {
                return (
                    <View
                        key={i}
                        style={[
                            styles.paginationDot,
                            index === i
                                ? styles.paginationDotActive
                                : styles.paginationDotInactive,
                        ]}
                    />
                );
            })}
        </View>
    );
}


const Caraousel: FC<Props> = (props) => {

    const { data } = props

    const [index, setIndex] = useState(0);
    const indexRef = useRef(index);
    indexRef.current = index;

    const onScroll = useCallback((event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);

        const distance = Math.abs(roundIndex - index);

        // Prevent one pixel triggering setIndex in the middle
        // of the transition. With this we have to scroll a bit
        // more to trigger the index change.
        const isNoMansLand = 0.4 < distance;

        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setIndex(roundIndex);
        }
    }, []);


    const [minAspectRatio, setMinAspectRatio] = useState<number>(1.5)
    const [aspectRatios, setAscpectRatios] = useState<Array<number>>(Array(data.length).fill(1.5))

    useEffect(() => {
        setAscpectRatios(Array(data.length).fill(1.5))

        const imagePromises: Array<Promise<number>> = data.map((img) => {
            return new Promise((resolve, reject) => {
                // @ts-ignore
                Image.getSize(img, (width: number, height: number) => {
                    resolve(width / height);
                }, () => reject(1))
            })
        })

        Promise
            .all(imagePromises)
            .then(images => {
                let minimumAspectRatioFromImages = Math.min(...images)
                setAscpectRatios([...images])
                let newMinRatio = Math.max(minimumAspectRatioFromImages, maximumMinAspectRatioAllowed)
                setMinAspectRatio(newMinRatio)
            })
            .catch((err) => {
                if (__DEV__) console.log("Get Image Size Error", err)
            })

    }, [])


    const caraouselStyle: ImageStyle = useMemo(() => {
        return {
            width: '100%',
            height: undefined,
            aspectRatio: minAspectRatio
        }
    }, [minAspectRatio])


    const flatListOptimizationProps = {
        windowSize: 2,
        initialNumToRender: 0,
        maxToRenderPerBatch: 1,
        scrollEventThrottle: 16,
        removeClippedSubviews: true,
        keyExtractor: useCallback((s: any) => String(s), []),
        getItemLayout: useCallback(
            (_: any, index: number) => ({
                index,
                length: (IMAGE_WIDTH),
                offset: index * (IMAGE_WIDTH),
            }),
            []
        ),
    };

    const renderItem = useCallback(({ item, index }: any) => {
        return <ImageSlide image={item} aspectRatio={aspectRatios[index]} />;
    }, [minAspectRatio, data]);

    return (
        <View>
            <FlatList
                data={data}
                horizontal
                pagingEnabled
                bounces={false}
                onScroll={onScroll}
                style={caraouselStyle}
                renderItem={renderItem}
                {...flatListOptimizationProps}
                showsHorizontalScrollIndicator={false}
            />
            <Pagination
                data={data}
                index={index}
            />
        </View>
    )
}

export default Caraousel


const styles = StyleSheet.create({
    slide: {
        alignItems: "center",
        width: IMAGE_WIDTH,
        justifyContent: "center",
    },
    pagination: {
        bottom: 8,
        width: "100%",
        flexDirection: "row",
        position: "absolute",
        justifyContent: "center",
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
    },
    paginationDotActive: {
        backgroundColor: "#65a765"
    },
    paginationDotInactive: {
        backgroundColor: "#e6ffe6"
    },
})