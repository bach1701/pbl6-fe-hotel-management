import React, { createContext, useContext, useState } from 'react';

const RoomDescriptionContext = createContext();

export const RoomDescriptionProvider = ({ children }) => {
    const descriptions = [
        "A cozy room with modern amenities.",
        "Spacious and bright, perfect for families.",
        "A luxurious suite with breathtaking views.",
        "Comfortable and affordable, ideal for business travelers.",
        "A serene retreat with a relaxing atmosphere."
    ];

    return (
        <RoomDescriptionContext.Provider value={descriptions}>
            {children}
        </RoomDescriptionContext.Provider>
    );
};

export const useRoomDescriptions = () => {
    return useContext(RoomDescriptionContext);
};