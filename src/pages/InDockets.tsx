import React from 'react';
import { useInDockets } from '../hooks/ApiHooks';
import { InDocket } from '../intefaces/InDocket';

const InDocketsPage = () => {
  const {getInDockets} = useInDockets();
  const [inDockets, setInDockets] = React.useState<InDocket[]>([]);
  const [inDocket, setInDocket] = React.useState<InDocket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const inDockets = await getInDockets();
      setInDockets(inDockets);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>InDockets</div>;
};

export default InDocketsPage;
