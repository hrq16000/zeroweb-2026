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

interface LeadsDigestEmailProps {
  count?: number
  filters?: string
  body?: string
}

export function LeadsDigestEmail({
  count = 0,
  filters = '',
  body = '',
}: LeadsDigestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`${count} lead(s) no recorte atual do painel 0WEB`}</Preview>
      <Body style={{ backgroundColor: '#0b0f14', fontFamily: 'Arial, sans-serif', margin: 0 }}>
        <Container style={{ padding: '32px', maxWidth: '640px' }}>
          <Heading style={{ color: '#e6f1ff', fontSize: '20px', margin: '0 0 8px' }}>
            Leads do painel 0WEB
          </Heading>
          <Text style={{ color: '#8fa3b8', fontSize: '14px', margin: '0 0 4px' }}>
            {count} lead(s) no recorte solicitado.
          </Text>
          <Text style={{ color: '#8fa3b8', fontSize: '12px', margin: '0 0 20px' }}>
            Filtros: {filters || 'nenhum'}
          </Text>
          <Section style={{ backgroundColor: '#111823', borderRadius: '10px', padding: '20px' }}>
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
  component: LeadsDigestEmail,
  displayName: 'Resumo de leads do painel',
  subject: (data: Record<string, any>) => `[0WEB] ${data?.count ?? 0} lead(s) no painel`,
  previewData: {
    count: 2,
    filters: 'origem=funil · etapa=todas',
    body: '• Fulano — funil — form_submitted — 31/08/2026 03:00',
  },
} satisfies TemplateEntry
