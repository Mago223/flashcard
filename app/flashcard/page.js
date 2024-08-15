'use client'

import { useUser } from "@clerk/clerk-react";
import {useEffect, useState} from "react";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Modal, Box, Container, TextField, Typography, Paper, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, Card } from "@mui/material";


import { useSearchParams } from "next/navigation";

export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [frontTextToEdit, setFrontTextToEdit] = useState("");
    const [backTextToEdit, setBackTextToEdit] = useState("");
    const [currentFlashcard, setCurrentFlashcard] = useState(null);
    const [flashcardUpdateTrigger, setFlashcardUpdateTrigger] = useState(0);

    const searchParams = useSearchParams();
    const search = searchParams.get("id");

    useEffect(()=>{
        async function getFlashcard(){
            if(!search || !user) return;
            const colRef = collection(doc(db, "users", user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];

            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()});
            })
            setFlashcards(flashcards)
        }
        getFlashcard();
    }, [user, search, flashcardUpdateTrigger])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const updateFlashcard = async (flashcard) => {
        if(!search || !user) return;
        const colRef = collection(doc(db, "users", user.id), search);
        const docs = await getDocs(colRef);

        docs.forEach((doc) => {
            if (doc.id === flashcard.id){
                setCurrentFlashcard(flashcard);
                setFrontTextToEdit(flashcard.front);
                setBackTextToEdit(flashcard.back);
                setSnackbarOpen(true);
            }
        })
    }

    const handleSnackbarCloseCancel = () => {
        setSnackbarOpen(false);
    };

    const handleSnackbarCloseSave = async () => {
        setSnackbarOpen(false);

        if(!search || !user) return;
        const colRef = collection(doc(db, "users", user.id), search);
        const docs = await getDocs(colRef);

        for (const doc of docs.docs) {
            if (doc.id === currentFlashcard.id){
                await updateDoc(doc.ref, {
                    front: frontTextToEdit,
                    back: backTextToEdit
                })

                setFlashcardUpdateTrigger(prev => prev + 1);
            }
        }
    };

    if (!isLoaded || !isSignedIn) return <></>;

    return (
        <Container maxWidth="100vw">
            <Modal
                open={snackbarOpen}
                onClose={handleSnackbarCloseCancel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                  <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
                >
                    <Box display="flex" alignItems={"center"} flexDirection={"column"} gap={2} sx={{mb: -2}}>
                        <Box gap={2} display="flex" flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"}>
                            <TextField value={frontTextToEdit} onChange={(e) => setFrontTextToEdit(e.target.value)} label="Edit Front" multiline />
                            <TextField value={backTextToEdit} onChange={(e) => setBackTextToEdit(e.target.value)} label="Edit Back" multiline />
                        </Box>
                        <Box gap={2} display="flex" flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"}>
                            <Button variant="contained" onClick={handleSnackbarCloseCancel}>Cancel</Button>
                            <Button variant="contained" onClick={handleSnackbarCloseSave}>Save</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Grid container spacing={3} sx={{mt: 4}}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(index)}>
                                    <CardContent>
                                        <Box sx={{perspective: '1000px', 
                                            '& > div':{
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                transform: flipped[index]
                                                ? 'rotateY(180deg)'
                                                : 'rotateY(0deg)'
                                            },
                                            '& > div > div':{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box'
                                            },
                                            '& > div > div:nth-of-type(2)':{
                                                transform: 'rotateY(180deg)'
                                            }
                                        }}>
                                            <div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center', // Center vertically
                                        justifyContent: 'center', // Optional: Center horizontally
                                    }}
                                    onClick={() => updateFlashcard(flashcard)}
                                    >
                                    <Button variant="contained" sx={{ mb: 2 }}>
                                        Edit
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    )
}