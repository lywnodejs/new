import React from 'react';
// import MD style & components
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
// default icon
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import StorageIcon from '@material-ui/icons/Storage';
import ClassIcon from '@material-ui/icons/Class';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import LayersIcon from '@material-ui/icons/Layers';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

interface TreeStructureState {
    data: any;
    minHeight?: any;
    handleClick: (title: string)=>void;
};

export const TreeStructure: React.FC<TreeStructureState> = ({
    data, minHeight='100%', handleClick
}) => {
    const useStyle = makeStyles((theme: Theme) => createStyles({
        treeView: {
            minHeight: minHeight,
            flexGrow: 1,
            maxWidth: 400,
        },
        treeItem: {
            padding: '3px 0px',
        },
        treeIcon: {
            color: theme.palette.type==='light'?(theme.palette.grey[700]):(theme.palette.grey[200]),
            fontSize: 20,
            margin: '-4px 3px',
        }
    }));

    const classes = useStyle();

    const renderTree = (nodes) => (
        <TreeItem 
            key={nodes.id} nodeId={nodes.id} 
            className={classes.treeItem}
            label={
                // only child node have onClick event
                // non-child node shouldn't have onClick event
                Array.isArray(nodes.children) ? (
                    <div>
                        {
                            nodes.icon === 'database' && <StorageIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'class' && <ClassIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'data' && <EqualizerIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'category' && <CategoryIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'accountTree' && <AccountTreeIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'layer' && <LayersIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'folderSpecial' && <FolderSpecialIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'idea' && <EmojiObjectsIcon className={classes.treeIcon} />
                        }{nodes.title}
                    </div>
                ) : (
                    <div onClick={()=>handleClick(nodes.title)}>
                        {
                            nodes.icon === 'database' && <StorageIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'class' && <ClassIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'data' && <EqualizerIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'category' && <CategoryIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'accountTree' && <AccountTreeIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'layer' && <LayersIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'folderSpecial' && <FolderSpecialIcon className={classes.treeIcon} /> ||
                            nodes.icon === 'idea' && <EmojiObjectsIcon className={classes.treeIcon} />
                        }{nodes.title}
                    </div>
                )
            }
        >
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    return (
        <TreeView
            className={classes.treeView}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['stu-model', 'teacher-model']}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {
                data.map(item => {
                    return renderTree(item);
                })
            }
        </TreeView>
    );
};