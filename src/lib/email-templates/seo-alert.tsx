import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface SeoAlertEmailProps {
  count?: number
  body?: string
}

export function SeoAlertEmail({ count = 1, body = '' }: SeoAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`${count} alerta(s) de indexação/SEO no portal 0WEB`}</Preview>
      <Body style={{ backgroundColor: '#0b0f14', fontFamily: 'Arial, sans-serif', margin: 0 }}>
        <Container style={{ padding: '32px', maxWidth: '640px' }}>
          <Heading style={{ color: '#e6f1ff', fontSize: '20px', margin: '0 0 8px' }}>
            Alerta de indexação / SEO
          </Heading>
          <Text style={{ color: '#8fa3b8', fontSize: '14px', margin: '0 0 20px' }}>
            {count} pendência(s) detectada(s) no monitoramento do portal.
          </Text>
          <Section
            style={{
              backgroundColor: '#111823',
              borderRadius: '10px',
              padding: '20px',
            }}
          >
            <Text
              style={{
                color: '#dbe7f3',
                fontSize: '13px',
                lineHeight: '20px',
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {body}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SeoAlertEmail,
  displayName: 'Alerta de SEO / indexação',
  subject: (data: Record<string, any>) =>
    `[0WEB] ${data?.count ?? 1} alerta(s) de indexação/SEO`,
  previewData: {
    count: 2,
    body: '• [high] Página não indexada\n  https://0web.com.br/servicos\n  Motivo: Descoberta - não indexada',
  },
} satisfies TemplateEntry
