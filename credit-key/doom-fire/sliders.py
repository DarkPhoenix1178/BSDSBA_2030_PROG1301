import streamlit as st

firesize = st.slider("Fire Size", 0, 100, 25)
st.write(f"Selected Size: {firesize}")
