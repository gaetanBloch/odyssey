export interface Settings {
  maps: Maps,
  features: Features,
}

interface Maps {
  ol: {
    ignVector: {
      title: string,
      default?: boolean,
      type: string,
      format: string,
      tileUrl: string,
      styleUrl: string
      attributions: Array<string>
    },
    osmRaster: {
      title: string,
      default?: boolean
    }
  };
  leaflet?: any;
}

interface Features {
  ol: {
    geolocation: Array<{
      title: string,
      default?: boolean,
      method: string,
      longitudeFieldPath: string,
      latitudeFieldPath: string,
      featuresFieldPath: string,
      requestUrl: string,
    }>,
    reverseGeolocation: Array<{
      title: string,
      default?: boolean,
      method: string,
      addressFieldPath: string,
      featuresFieldPath: string,
      requestUrl: string,
    }>,
    itinerary: Array<{
      title: string,
      default?: boolean,
      method: string
      requestUrl: string,
      format: string,
      drawFieldPath: string,
      distanceFieldPath: string,
      durationFieldPath: string,
    }>
  }
}
