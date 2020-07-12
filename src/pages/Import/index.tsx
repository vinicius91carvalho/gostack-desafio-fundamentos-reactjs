/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);

  async function handleUpload(): Promise<void> {
    for (const uploadedFile of uploadedFiles) {
      const formData = new FormData();

      formData.append('file', uploadedFile.file);

      try {
        // eslint-disable-next-line no-await-in-loop
        const { data: transactions } = await api.post(
          '/transactions/import',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log('Transactions: ', transactions);
      } catch (err) {
        console.log(err.response.error);
      }
    }
  }

  function submitFile(files: File[]): void {
    const filesToUpload = new Array<FileProps>();
    for (const file of files) {
      filesToUpload.push({
        file,
        name: file.name,
        readableSize: filesize(file.size),
      });
    }
    setUploadedFiles([...uploadedFiles, ...filesToUpload]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
