import { AssetsManager, IAssetTask, MeshAssetTask, ImageAssetTask, TextureAssetTask, Mesh, Texture } from 'babylonjs';

type LoadedAssets = {
    meshes: Map<string, Mesh>,
    images: Map<string, HTMLImageElement>,
    textures: Map<string, Texture>,
};

export default async function loadAssets(assetsManager: AssetsManager) : Promise<LoadedAssets> {

    return await new Promise<LoadedAssets>((resolve, reject) => {
        assetsManager.onTaskError = reject;
        assetsManager.onFinish = (tasks: any[]) => {

            const assets: LoadedAssets = {
                meshes: new Map<string, Mesh>(),
                images: new Map<string, HTMLImageElement>(),
                textures: new Map<string, Texture>(),
            };

            tasks.map(task => {
                const tasknameparts = (task.name as string).split(":");
                const assettype = tasknameparts[0];
                const assetname = tasknameparts[1];

                switch(assettype) {
                    case "mesh": {
                        const meshtask = (task as MeshAssetTask);
                        const mainmesh = meshtask.loadedMeshes[0] as Mesh;
                        mainmesh.setEnabled(false);
                        
                        assets["meshes"].set(assetname, mainmesh);

                        break;
                    }
                    case "image": {
                        const imagetask = task as ImageAssetTask;
                        assets["images"].set(assetname, imagetask.image);
                        break;
                    }
                    case "texture": {
                        const texturetask = task as TextureAssetTask;
                        assets["textures"].set(assetname, texturetask.texture);
                        break;
                    }
                }
            });

            resolve(assets);
        };

        assetsManager.load();
    });
}