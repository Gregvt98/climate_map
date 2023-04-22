import PostCard from "@/components/card";
import TransitionsModal from "@/components/messagemodal";
import KeepMountedModal from "@/components/keepmountedmodal";
import ScrollDialog from "@/components/scrolldialog";
import { Typography } from "@mui/material";
import PersistentDrawer from "@/components/persistentdrawer";

export default function showTest() {
    return (
    <>
    <ScrollDialog info="Map information"/>
    <KeepMountedModal>
        <Typography>This is a wrapped typography component</Typography>
    </KeepMountedModal>
    <TransitionsModal main="Message" description="Message description"/>
    <PersistentDrawer/>
    </>
    )
}