import ImageColors from 'react-native-image-colors'
import React, { useCallback, memo, useRef, useState, FC, useEffect, useMemo } from "react";
import { FlatList, View, Dimensions, StyleSheet, Image, ImageStyle, NativeModules } from "react-native";


const { width: windowWidth, height: windowHeight } = Dimensions.get("window");


interface Props {
    data: Array<string>
}

const colorConfig = {
    fallback: '#ffffff',
    cache: true,
}

const defaultBg = "#ffffff"

const ImageSlide = ({ image, aspectRatio }: any) => {

    const imageSource = { uri: image }

    const [isLoading, setIsLoading] = useState(false)
    const [bgColor, setBgColor] = useState(defaultBg)

    const fetchBgColor = async () => {

        setIsLoading(true)

        const result = await ImageColors.getColors(image, colorConfig)

        if (result.platform === 'ios')
            setBgColor(result.primary)
        else if (result.platform === 'android')
            setBgColor(result.average ? result.average : defaultBg)

        setIsLoading(false)

    }

    useEffect(() => {
        fetchBgColor()
    }, [image])

    const imagStyle: ImageStyle = useMemo(() => {
        return {
            width: "100%",
            height: undefined,
            resizeMode: 'contain',
            aspectRatio: aspectRatio
        }
    }, [aspectRatio])

    return (
        <View style={[styles.slide, { backgroundColor: bgColor }]}>
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

// This variable ensures that Height of the Image do not exceed certain amount
const maximumMinAspectRatioAllowed = (windowWidth / windowHeight) * 1.7

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


    const [isLoading, setIsLoading] = useState(false)
    const [minAspectRatio, setMinAspectRatio] = useState<number>(1.5)
    const [aspectRatios, setAscpectRatios] = useState<Array<number>>(Array(data.length).fill(1.5))

    useEffect(() => {
        setIsLoading(true)
        setAscpectRatios(Array(data.length).fill(1.5))

        const imagePromises = data.map((img) => {
            return new Promise((resolve, reject) => {
                // @ts-ignore
                Image.getSize(img, (width: number, height: number) => {
                    resolve({
                        width: width,
                        height: height,
                    });
                }, () => reject({ width: 1, height: 1 }))
            })
        })

        Promise
            .all(imagePromises)
            .then(images => {
                const newAspectRatios = images.map((obj: any) => (obj.width / obj.height))
                let minimumAspectRatioFromImages = Math.min(...newAspectRatios)
                setAscpectRatios([...newAspectRatios])
                let newMinRatio = Math.max(minimumAspectRatioFromImages, maximumMinAspectRatioAllowed)
                if (!isNaN(newMinRatio)) setMinAspectRatio(newMinRatio)
            })
            .catch((err) => {
                if (__DEV__) console.log("Get Image Size Error", err)
            })
            .finally(() => setIsLoading(false))

    }, [])


    const caraouselStyle: ImageStyle = useMemo(() => {
        return {
            width: '100%',
            height: undefined,
            aspectRatio: minAspectRatio
        }
    }, [minAspectRatio])


    const flatListOptimizationProps = {
        initialNumToRender: 0,
        maxToRenderPerBatch: 1,
        removeClippedSubviews: true,
        scrollEventThrottle: 16,
        windowSize: 2,
        keyExtractor: useCallback((s: any) => String(s), []),
    };

    const renderItem = useCallback(({ item, index }: any) => {
        return <ImageSlide image={item} aspectRatio={aspectRatios[index]} />;
    }, [minAspectRatio, data]);

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                horizontal
                pagingEnabled
                bounces={false}
                onScroll={onScroll}
                style={caraouselStyle}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                {...flatListOptimizationProps}
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
    container: {

    },
    slide: {
        width: windowWidth - 20,
        justifyContent: "center",
        alignItems: "center",
    },
    slideImage: {

    },
    pagination: {
        position: "absolute",
        bottom: 8,
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
    },
    paginationDotActive: {
        backgroundColor: "green"
    },
    paginationDotInactive: {
        backgroundColor: "gray"
    },
    carousel: {

    },
})