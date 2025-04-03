import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../axiosConfig';

import { Box, Flex } from "@chakra-ui/react";
import ClassicTemplatePreview from './ClassicTemplate/ClassicTemplatePreview';
import ModernTemplatePreview from './ModernTemplate/ModernTemplatePreview';
import MinimalisticTemplatePreview from './MinimalisticTemplate/MinimalisticTemplatePreview';
import CreativeTemplatePreview from './CreativeTemplate/CreativeTemplatePreview';

function PortfolioPreview() {
    const { previewId } = useParams();
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPreviewData() {
            try {
                const response = await apiClient.get(`https://localhost:7146/api/portfolio/preview/${previewId}`);
                console.log(response.data);
                setPortfolioData(response.data);
            } catch (error) {
                console.error('Failed to fetch preview data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPreviewData();
    }, [previewId]);


    if (loading) return <p>Loading preview...</p>;
    if (!portfolioData) return <p>Preview not found!</p>;

    let TemplateComponent;
    switch (portfolioData.templateId) {
        case "67b36f341f501c852ab69bc8": //Classic template id
            TemplateComponent = ClassicTemplatePreview;
            break;
        case "67b4c45ef97a09e418194e93": //Modern template id
            TemplateComponent = ModernTemplatePreview;
            break;
        case "67bf3e179459976f91d4cd46": //Minimalistic template id
            TemplateComponent = MinimalisticTemplatePreview;
            break;
        case "67bf385f9459976f91d4cd36"://Creative template id
            TemplateComponent = CreativeTemplatePreview;
            break;
        default:
            TemplateComponent = ClassicTemplatePreview;
            break;
    }

    return (
        <Flex>
            <Box>
                <TemplateComponent portfolioData={portfolioData} />
            </Box>
        </Flex>
    );
}

export default PortfolioPreview;