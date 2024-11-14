# map-react-ts

This project is a working example of Google Maps in a React app.

## Features
 - Responsive
 - Basic map interaction (pan, zoom, and place selection)
 - Add/remove places by clicking on the map
 - Collapsible sidebar with places list
 - Places list virtualization
 - Center on current location (based on browser permission)
 - Map clustering


## Development Server

1. Request for environment variables, and place these in the .env file.

2. Install any dependencies.

3. Run the development server

```sh
touch .env
npm install
npm run dev
```

## Notes

 - The `MemoMarker` component is a separated `<AdvancedMarker` component from the map because, otherwise, the `ref` function was causing infinite re-renders.